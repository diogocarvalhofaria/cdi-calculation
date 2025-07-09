import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer.component';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent {
  blogPosts: BlogPost[] = [
    {
      id: 'cdi-e-investimentos',
      title: 'O que é o CDI e como ele impacta meus investimentos?',
      description: 'Entenda a importância do CDI e como ele afeta o rendimento dos seus investimentos de renda fixa.',
      imageUrl: 'assets/images/cdi-article.jpg',
      date: '15 de agosto de 2023'
    },
    {
      id: 'cdb-lci-tesouro-selic',
      title: 'Diferença entre CDB, LCI e Tesouro Selic',
      description: 'Conheça as características, vantagens e desvantagens de cada tipo de investimento.',
      imageUrl: 'assets/images/investment-types.jpg',
      date: '22 de setembro de 2023'
    },
    {
      id: 'imposto-renda-renda-fixa',
      title: 'Como funciona o Imposto de Renda em investimentos de renda fixa',
      description: 'Um guia completo sobre a tributação dos seus investimentos e como planejar-se melhor.',
      imageUrl: 'assets/images/tax-guide.jpg',
      date: '10 de outubro de 2023'
    }
  ];
}
