import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {
  NgApexchartsModule,
  ChartComponent,
} from 'ng-apexcharts';

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
  result = {
    finalValue: 0,
    totalInvested: 0,
    interest: 0
  };

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
      toolbar: {
        show: false
      },
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
    colors: ['#22c55e', '#94a3b8'],
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
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      title: {
        text: 'Meses',
        style: {
          color: '#334155',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => 'R$ ' + val.toFixed(0),
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      },
      title: {
        text: 'Valor (R$)',
        style: {
          color: '#334155',
          fontWeight: 500
        }
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px'
      },
      y: {
        formatter: (val: number) => 'R$ ' + val.toFixed(2)
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      }
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
    // Usar o valor numérico puro, sem formatação
    const stringValue = value.toString();
    navigator.clipboard.writeText(stringValue).then(() => {
      // Opcional: adicionar feedback visual como um toast/snackbar
      alert('Valor copiado: ' + stringValue);
    });
  }

  motivationalPhrase = '';

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
    if (period > 300) {
      labelInterval = 60; // A cada 5 anos para períodos enormes
    } else if (period > 120) {
      labelInterval = 24; // A cada 2 anos para períodos grandes
    } else if (period > 60) {
      labelInterval = 12; // Anual para períodos médios
    } else if (period > 24) {
      labelInterval = 6; // Semestral para períodos pequenos
    } else {
      labelInterval = 1; // Mensal para períodos curtos
    }

    for (let i = 1; i <= period; i++) {
      totalValue = totalValue * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
      chartValues.push(totalValue);
      chartInvested.push(totalInvested);

      if (i % labelInterval === 0 || i === period) {
        if (i % 12 === 0) {
          chartMonths.push(i / 12 + ' anos');
        } else {
          chartMonths.push(i + ' m');
        }
      } else {
        chartMonths.push('');
      }
    }

    this.result = {
      finalValue: totalValue,
      totalInvested: totalInvested,
      interest: totalValue - totalInvested
    };

    // Atualiza as opções do gráfico diretamente
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Valor Total',
          data: chartValues
        },
        {
          name: 'Valor Investido',
          data: chartInvested
        }
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
