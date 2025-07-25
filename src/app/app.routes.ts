import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogListComponent } from './blog/blog-list.component';
import { CdiArticleComponent } from './blog/cdi-article.component';
import { InvestmentTypesComponent } from './blog/investment-types.component';
import { TaxArticleComponent } from './blog/tax-article.component';
import { PrivacyPolicyComponent } from './blog/privacy-policy.component';
import { TermsOfUseComponent } from './blog/terms-of-use.component';
import {AuthComponent} from './auth/auth.component';
import {RegisterComponent} from './auth/register.component';
import {authGuard} from './guards/auth.guard';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/cdi-e-investimentos', component: CdiArticleComponent },
  { path: 'blog/cdb-lci-tesouro-selic', component: InvestmentTypesComponent },
  { path: 'blog/imposto-renda-renda-fixa', component: TaxArticleComponent },
  { path: 'politica-privacidade', component: PrivacyPolicyComponent },
  { path: 'termos-uso', component: TermsOfUseComponent },
  {path: 'auth', component: AuthComponent},
  {path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: '' },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: RegisterComponent },

  // A rota 'profile' é protegida. O guard será verificado antes de acessá-la.
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard] // O guard protege esta rota
  },

  // Rotas padrão
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
