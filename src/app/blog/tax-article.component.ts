import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/footer.component';

@Component({
  selector: 'app-tax-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tax-list.component.html',
})
export class TaxArticleComponent {}
