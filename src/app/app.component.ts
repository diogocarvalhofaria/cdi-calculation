import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ChartComponent,
} from 'ng-apexcharts';

interface SimulationResult {
  finalValue: number;
  totalInvested: number;
  interest: number;
  ir: number;
  iof: number;
  netInterest: number;
  finalValueAfterTax: number;
  rentabilidade: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule]
})
export class AppComponent {
  @ViewChild('chart') chart!: ChartComponent;

  cdiForm: FormGroup;
  months = [6, 12, 24, 36, 48, 60];
  showResult = false;

  result: SimulationResult = {
    finalValue: 0,
    totalInvested: 0,
    interest: 0,
    ir: 0,
    iof: 0,
    netInterest: 0,
    finalValueAfterTax: 0,
    rentabilidade: 0
  };

  motivationalPhrase = '';

  chartOptions: any = {
    series: [
      {
        name: 'Valor Total',
        data: []
      },
      {
        name: 'Valor Investido',
        data: []
      }
    ],
    chart: {
      height: 400,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.15
      }
    },
    colors: ['#155dfc', '#94a3b8'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.7,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: 'Meses',
        style: { color: '#334155', fontWeight: 500 }
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => 'R$ ' + val.toFixed(0),
        style: { colors: '#64748b', fontSize: '12px' }
      },
      title: {
        text: 'Valor (R$)',
        style: { color: '#334155', fontWeight: 500 }
      }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px' },
      y: {
        formatter: (val: number) => 'R$ ' + val.toFixed(2)
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    legend: {
      labels: {
        colors: '#334155',
        useSeriesColors: false
      }
    }
  };

  constructor(private fb: FormBuilder) {
    this.cdiForm = this.fb.group({
      cdiPercent: [100, [Validators.required, Validators.min(0)]],
      initialValue: [1000, [Validators.required, Validators.min(0)]],
      period: [12, [Validators.required]],
      monthlyContribution: [0, [Validators.min(0)]],
      cdiAnnual: [13.65, [Validators.required, Validators.min(0)]]
    });
  }

  copyToClipboard(value: number) {
    const stringValue = value.toString();
    navigator.clipboard.writeText(stringValue).then(() => {
      alert('Valor copiado: ' + stringValue);
    });
  }

  getMotivationalPhrase(initialValue: number, period: number): string {
    let phrase = '';

    if (initialValue < 1000) {
      phrase = "Todo grande investidor começou com o primeiro passo. O importante é começar!";
    } else if (initialValue <= 50000) {
      phrase = "Você já está plantando sua liberdade financeira. Continue regando!";
    } else {
      phrase = "Você não está só investindo dinheiro. Está comprando tempo, liberdade e paz.";
    }

    if (period >= 60) {
      phrase += " O tempo está do seu lado — continue firme.";
    } else if (period >= 12) {
      phrase += " Com paciência e consistência, os frutos vão aparecer.";
    }

    return phrase;
  }

  calcImposto(rendimentoBruto: number, dias: number): { ir: number, iof: number, liquido: number } {
    let aliquotaIR = 0;
    if (dias <= 180) aliquotaIR = 22.5;
    else if (dias <= 360) aliquotaIR = 20;
    else if (dias <= 720) aliquotaIR = 17.5;
    else aliquotaIR = 15;

    let aliquotaIOF = 0;
    if (dias <= 30) {
      const iofTabela = [
        96, 93, 90, 86, 83, 80, 76, 73, 70, 66,
        63, 60, 56, 53, 50, 46, 43, 40, 36, 33,
        30, 26, 23, 20, 16, 13, 10, 6, 3, 0
      ];
      aliquotaIOF = iofTabela[dias - 1] / 100;
    }

    const iof = rendimentoBruto * aliquotaIOF;
    const ir = (rendimentoBruto - iof) * (aliquotaIR / 100);
    const liquido = rendimentoBruto - iof - ir;

    return { ir, iof, liquido };
  }

  onCalculate() {
    if (!this.cdiForm.valid) return;

    const cdiPercent = this.cdiForm.value.cdiPercent / 100;
    const initialValue = this.cdiForm.value.initialValue;
    const period = this.cdiForm.value.period;
    const monthlyContribution = this.cdiForm.value.monthlyContribution;

    const cdiAnnual = this.cdiForm.value.cdiAnnual / 100;
    const cdiMonthly = cdiAnnual / 12;
    const monthlyRate = cdiMonthly * cdiPercent;

    this.motivationalPhrase = this.getMotivationalPhrase(initialValue, period);

    let totalValue = initialValue;
    let totalInvested = initialValue;

    const chartValues = [initialValue];
    const chartInvested = [initialValue];
    let chartMonths = ['0'];

    let labelInterval;
    if (period > 300) labelInterval = 60;
    else if (period > 120) labelInterval = 24;
    else if (period > 60) labelInterval = 12;
    else if (period > 24) labelInterval = 6;
    else labelInterval = 1;

    for (let i = 1; i <= period; i++) {
      totalValue = totalValue * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
      chartValues.push(totalValue);
      chartInvested.push(totalInvested);

      if (i % labelInterval === 0 || i === period) {
        if (i % 12 === 0) chartMonths.push(i / 12 + ' anos');
        else chartMonths.push(i + ' m');
      } else {
        chartMonths.push('');
      }
    }



    const rendimentoBruto = totalValue - totalInvested;
    const diasEstimados = period * 30;
    const { ir, iof, liquido } = this.calcImposto(rendimentoBruto, diasEstimados);

    this.result = {
      finalValue: totalValue,
      totalInvested: totalInvested,
      interest: rendimentoBruto,
      ir,
      iof,
      netInterest: liquido,
      finalValueAfterTax: totalInvested + liquido,
      rentabilidade: 0 // inicialização
    };

    this.result.rentabilidade = ((this.result.finalValueAfterTax / totalInvested) - 1) * 100;

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        { name: 'Valor Total', data: chartValues },
        { name: 'Valor Investido', data: chartInvested }
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: chartMonths,
        labels: {
          ...this.chartOptions.xaxis.labels,
          rotate: -45,
          rotateAlways: period > 60,
          hideOverlappingLabels: true,
          style: {
            ...this.chartOptions.xaxis.labels.style,
            fontSize: period > 60 ? '10px' : '12px'
          }
        }
      }
    };



    this.showResult = true;
  }
}
