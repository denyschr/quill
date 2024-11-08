import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@app/shared/data-access/services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const request = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Token ${token}` } : {})
    }
  });

  return next(request);
};
