import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      if (errorResponse.status === 401) {
        void router.navigateByUrl('/login');
      }
      return throwError(() => errorResponse.error);
    })
  );
};
