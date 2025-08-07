import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgApexchartsModule, ChartComponent} from 'ng-apexcharts';
import {RouterModule} from '@angular/router';

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
  selector: 'app-home',
  standalone: true,
  templateUrl: './home-list.component.html',
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule, RouterModule]
})
export class HomeComponent {
  @ViewChild('chart') chart!: ChartComponent;

  cdiForm: FormGroup;
  showResult = true;

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
      toolbar: {show: false},
      zoom: {enabled: false},
      sparkline: {enabled: false},
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.15
      }
    },
    colors: ['#2563eb', '#94a3b8'],
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
    dataLabels: {enabled: false},
    stroke: {curve: 'smooth', width: 3},
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        rotate: -45,
        hideOverlappingLabels: true,
        formatter: function (value: string) {
          if (value && value.endsWith('m')) {
            const month = parseInt(value.replace('m', ''));
            if (month > 0 && month % 12 === 0) {
              return `${month / 12}a`;
            }
            if (month % 12 !== 0 && month > 12) {
              return value;
            }
          }
          return value;
        }
      },
      axisBorder: {show: false},
      axisTicks: {show: false},
      title: {
        text: 'Período',
        style: {color: '#334155', fontWeight: 500}
      }
    },
    yaxis: {
      labels: {
        style: {colors: '#64748b', fontSize: '12px'},
        formatter: function (value: number) {
          if (typeof value !== 'undefined' && value !== null) {
            return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
          }
          return value;
        }
      },
      title: {
        text: 'Valor (R$)',
        style: {color: '#334155', fontWeight: 500}
      }
    },
    tooltip: {
      theme: 'light',
      style: {fontSize: '13px'},
      y: {
        formatter: function (value: number) {
          if (typeof value !== 'undefined' && value !== null) {
            return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
          }
          return value;
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {lines: {show: false}}
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: '#334155',
        useSeriesColors: false
      }
    }
  };

  constructor(private fb: FormBuilder,
  ) {
    this.cdiForm = this.fb.group({
      cdiPercent: [100, [Validators.required, Validators.min(0)]],
      initialValue: [1000, [Validators.required, Validators.min(0)]],
      period: [12, [Validators.required, Validators.min(1)]],
      periodType: ['meses', Validators.required],
      monthlyContribution: [0, [Validators.min(0)]],
      cdiAnnual: [15, [Validators.required, Validators.min(0)]],
      showTaxes: [true]
    });
  }

  getMotivationalPhrase(initialValue: number, periodInMonths: number): string {
    let phrase = '';

    if (initialValue < 1000) {
      phrase = "Todo grande investidor começou com o primeiro passo. O importante é começar!";
    } else if (initialValue <= 50000) {
      phrase = "Você já está a plantar a sua liberdade financeira. Continue a regar!";
    } else {
      phrase = "Você não está só a investir dinheiro. Está a comprar tempo, liberdade e paz.";
    }

    if (periodInMonths >= 60) {
      phrase += " O tempo está do seu lado — continue firme.";
    } else if (periodInMonths >= 12) {
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
    if (dias < 30) {
      const iofTabela = [
        96, 93, 90, 86, 83, 80, 76, 73, 70, 66,
        63, 60, 56, 53, 50, 46, 43, 40, 36, 33,
        30, 26, 23, 20, 16, 13, 10, 6, 3, 0
      ];
      aliquotaIOF = dias > 0 ? (iofTabela[Math.floor(dias) - 1] || 0) / 100 : 0;
    }

    const iof = rendimentoBruto * aliquotaIOF;
    const ir = (rendimentoBruto - iof) * (aliquotaIR / 100);
    const liquido = rendimentoBruto - iof - ir;

    return {ir, iof, liquido};
  }

  onCalculate() {
    if (!this.cdiForm.valid) return;

    const {
      cdiPercent,
      initialValue,
      period,
      periodType,
      monthlyContribution,
      showTaxes,
      cdiAnnual
    } = this.cdiForm.value;

    const totalMonths = periodType === 'anos' ? period * 12 : period;

    const cdiMonthly = (cdiAnnual / 100) / 12;
    const monthlyRate = cdiMonthly * (cdiPercent / 100);

    this.motivationalPhrase = this.getMotivationalPhrase(initialValue, totalMonths);

    let totalValue = initialValue;
    let totalInvested = initialValue;

    const chartValues = [initialValue];
    const chartInvested = [initialValue];
    const chartMonths: string[] = ['Início'];

    for (let i = 1; i <= totalMonths; i++) {
      totalValue += totalValue * monthlyRate;
      if (monthlyContribution > 0) {
        totalValue += monthlyContribution;
        totalInvested += monthlyContribution;
      }

      chartValues.push(parseFloat(totalValue.toFixed(2)));
      chartInvested.push(parseFloat(totalInvested.toFixed(2)));
      chartMonths.push(`${i}m`);
    }

    const rendimentoBruto = totalValue - totalInvested;
    const diasEstimados = totalMonths * 30.4167;
    let ir = 0, iof = 0, liquido = rendimentoBruto;

    if (showTaxes) {
      const impostos = this.calcImposto(rendimentoBruto, diasEstimados);
      ir = impostos.ir;
      iof = impostos.iof;
      liquido = impostos.liquido;
    }

    this.result = {
      finalValue: totalValue,
      totalInvested: totalInvested,
      interest: rendimentoBruto,
      ir: ir,
      iof: iof,
      netInterest: liquido,
      finalValueAfterTax: totalInvested + liquido,
      rentabilidade: ((totalInvested + liquido) / totalInvested - 1) * 100
    };

    let tickAmount;
    if (totalMonths > 36) {
      tickAmount = 12; // Define um número fixo de marcadores para períodos longos
    } else {
      tickAmount = totalMonths;
    }

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {name: 'Valor Total', data: chartValues},
        {name: 'Valor Investido', data: chartInvested}
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: chartMonths,
        tickAmount: tickAmount,
      }
    };

    this.showResult = true;
  }
}
