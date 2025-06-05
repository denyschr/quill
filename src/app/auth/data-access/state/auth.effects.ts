import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

import { JwtTokenStorage, UserApiClient } from '../api';

import { authActions } from './auth.actions';

export const getCurrentUser$ = createEffect(
  (
    actions$ = inject(Actions),
    userApiClient = inject(UserApiClient),
    jwtTokenStorage = inject(JwtTokenStorage)
  ) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const token = jwtTokenStorage.get();

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

export const updateCurrentUser$ = createEffect(
  (actions$ = inject(Actions), userApiClient = inject(UserApiClient)) => {
    return actions$.pipe(
      ofType(authActions.updateCurrentUser),
      concatMap(({ user }) =>
        userApiClient.update(user).pipe(
          map(currentUser => authActions.updateCurrentUserSuccess({ currentUser })),
          catchError(error => of(authActions.updateCurrentUserFailure({ errors: error.errors })))
        )
      )
    );
  },
  { functional: true }
);

export const updateCurrentUserSuccess$ = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    jwtTokenStorage = inject(JwtTokenStorage)
  ) => {
    return actions$.pipe(
      ofType(authActions.updateCurrentUserSuccess),
      tap(({ currentUser }) => {
        jwtTokenStorage.save(currentUser.token);
        router.navigate(['/profile', currentUser.username]);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const register$ = createEffect(
  (actions$ = inject(Actions), userApiClient = inject(UserApiClient)) => {
    return actions$.pipe(
      ofType(authActions.register),
      switchMap(({ credentials }) =>
        userApiClient.register(credentials).pipe(
          map(currentUser => authActions.registerSuccess({ currentUser })),
          catchError(error => of(authActions.registerFailure({ errors: error.errors })))
        )
      )
    );
  },
  { functional: true }
);

export const login$ = createEffect(
  (actions$ = inject(Actions), userApiClient = inject(UserApiClient)) => {
    return actions$.pipe(
      ofType(authActions.login),
      switchMap(({ credentials }) =>
        userApiClient.login(credentials).pipe(
          map(currentUser => authActions.loginSuccess({ currentUser })),
          catchError(error => of(authActions.loginFailure({ errors: error.errors })))
        )
      )
    );
  },
  { functional: true }
);

export const registerOrLoginSuccess$ = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    jwtTokenStorage = inject(JwtTokenStorage)
  ) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess, authActions.loginSuccess),
      tap(({ currentUser }) => {
        jwtTokenStorage.save(currentUser.token);
        router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);

export const logout$ = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    jwtTokenStorage = inject(JwtTokenStorage)
  ) => {
    return actions$.pipe(
      ofType(authActions.logout),
      tap(() => {
        jwtTokenStorage.remove();
        router.navigateByUrl('/');
      })
    );
  },
  { functional: true, dispatch: false }
);
