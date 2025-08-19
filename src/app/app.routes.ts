import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogListComponent } from './blog/blog-list.component';
import { CdiArticleComponent } from './blog/cdi-article.component';
import { InvestmentTypesComponent } from './blog/investment-types.component';
import { TaxArticleComponent } from './blog/tax-article.component';
import { PrivacyPolicyComponent } from './blog/privacy-policy.component';
import { TermsOfUseComponent } from './blog/terms-of-use.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import {LinkInvalidComponent} from './auth/link-invalid.component';
import {VerifyEmailComponent} from './auth/verify-email.component';
import {ForgotPasswordComponent} from './auth/forgot-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/cdi-e-investimentos', component: CdiArticleComponent },
  { path: 'blog/cdb-lci-tesouro-selic', component: InvestmentTypesComponent },
  { path: 'blog/imposto-renda-renda-fixa', component: TaxArticleComponent },
  { path: 'politica-privacidade', component: PrivacyPolicyComponent },
  { path: 'termos-uso', component: TermsOfUseComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'link-invalid', component: LinkInvalidComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  {
    path: 'auth/verify-email',
    loadComponent: () => import('./auth/verify-email.component').then(m => m.VerifyEmailComponent),
  },
  // Rota curinga (deve ser sempre a última)
  { path: '**', redirectTo: '' }
];
