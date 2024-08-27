import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@auth/data-access/services';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtService } from '@shared/data-access/services/jwt';
import { Router } from '@angular/router';

export const getCurrentUserEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const token = jwtService.getToken();

        if (!token) {
          return of(authActions.getCurrentUserFailure());
        }

        return authService.getCurrentUser().pipe(
          map(currentUser => {
            return authActions.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => of(authActions.getCurrentUserFailure()))
        );
      })
    );
  },
  { functional: true }
);

export const registerEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.register),
      switchMap(({ credentials }) =>
        authService.register(credentials).pipe(
          map(currentUser => {
            jwtService.saveToken(currentUser.token);
            return authActions.registerSuccess({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.registerFailure({ errors: errorResponse.error.errors }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterRegisterEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess),
      tap(() => {
        router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.login),
      switchMap(({ credentials }) =>
        authService.login(credentials).pipe(
          map(currentUser => {
            jwtService.saveToken(currentUser.token);
            return authActions.loginSuccess({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.loginFailure({ errors: errorResponse.error.errors }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterLoginEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(() => {
        router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);
