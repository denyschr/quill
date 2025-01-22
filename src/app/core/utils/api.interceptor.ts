import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiRequest = req.clone({ url: `${environment.apiUrl}/api${req.url}` });
  return next(apiRequest);
};
