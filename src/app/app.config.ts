import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { withHashLocation, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { withInterceptors, provideHttpClient, withFetch } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { inject } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule, ReactiveFormsModule),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'http://localhost:3000/graphql' })
      };
    }),
    provideAnimations()
  ]
};
