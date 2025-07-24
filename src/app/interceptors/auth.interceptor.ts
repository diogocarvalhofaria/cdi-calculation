import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

// Exportando como uma função, que é o padrão moderno
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeta o serviço
  const authToken = authService.getToken();

  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  }

  return next(req);
};
