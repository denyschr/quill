import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@app/auth/data-access/services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();
  if (token) {
    const clone = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
    return next(clone);
  }
  return next(req);
};
