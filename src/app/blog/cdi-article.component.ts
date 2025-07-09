import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/footer.component';

@Component({
  selector: 'app-cdi-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cdi-article.component.html'
})
export class CdiArticleComponent {}
