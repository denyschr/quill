import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { JwtTokenStorage } from '@/app/auth/data-access/api';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtTokenStorage).get();
  if (token) {
    const clone = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
    return next(clone);
  }
  return next(req);
};
