import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserApiClient } from '@shared/data-access/api';
import { JwtService } from '@shared/data-access/services';

export const getCurrentUser = createEffect(
  (
    actions$ = inject(Actions),
    userApiClient = inject(UserApiClient),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const token = jwtService.getToken();
        if (!token) {
          return of(authActions.getCurrentUserFailure());
        }

        return userApiClient.getCurrentUser().pipe(
          map(currentUser => authActions.getCurrentUserSuccess({ currentUser })),
          catchError(() => of(authActions.getCurrentUserFailure()))
        );
      })
    );
  },
  { functional: true }
);

export const register = createEffect(
  (
    actions$ = inject(Actions),
    userApiClient = inject(UserApiClient),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.register),
      switchMap(({ credentials }) =>
        userApiClient.register(credentials).pipe(
          tap(currentUser => jwtService.saveToken(currentUser.token)),
          map(currentUser => authActions.registerSuccess({ currentUser })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.registerFailure({ errors: errorResponse.error.errors }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const updateCurrentUser = createEffect(
  (actions$ = inject(Actions), userApiClient = inject(UserApiClient)) => {
    return actions$.pipe(
      ofType(authActions.updateCurrentUser),
      switchMap(({ user }) => {
        return userApiClient.update(user).pipe(
          map(currentUser => authActions.updateCurrentUserSuccess({ currentUser })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.updateCurrentUserFailure({ errors: errorResponse.error.errors }))
          )
        );
      })
    );
  },
  { functional: true }
);

export const registerSuccess = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess),
      tap(() => {
        void router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);

export const login = createEffect(
  (
    actions$ = inject(Actions),
    userApiClient = inject(UserApiClient),
    jwtService = inject(JwtService)
  ) => {
    return actions$.pipe(
      ofType(authActions.login),
      switchMap(({ credentials }) =>
        userApiClient.login(credentials).pipe(
          tap(currentUser => jwtService.saveToken(currentUser.token)),
          map(currentUser => authActions.loginSuccess({ currentUser })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.loginFailure({ errors: errorResponse.error.errors }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const loginSuccess = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(() => {
        void router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);

export const logout = createEffect(
  (actions$ = inject(Actions), router = inject(Router), jwtService = inject(JwtService)) => {
    return actions$.pipe(
      ofType(authActions.logout),
      tap(() => {
        jwtService.removeToken();
        void router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);
