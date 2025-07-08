import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/footer.component';

@Component({
  selector: 'app-investment-types',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './investment-list.component.html',
})
export class InvestmentTypesComponent {}
