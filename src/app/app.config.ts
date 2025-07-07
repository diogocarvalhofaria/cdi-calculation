import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule, ReactiveFormsModule),
    provideRouter(routes, withHashLocation())
  ]
};
