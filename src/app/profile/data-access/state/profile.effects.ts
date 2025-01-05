import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { profileActions } from './profile.actions';
import { ProfileApiClient } from '@shared/data-access/api';
import { Router } from '@angular/router';

export const loadProfile$ = createEffect(
  (actions$ = inject(Actions), profileClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(profileActions.loadProfile),
      switchMap(({ username }) =>
        profileClient.get(username).pipe(
          map(profile => profileActions.loadProfileSuccess({ profile })),
          catchError(() => of(profileActions.loadProfileFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const loadProfileFailure$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(profileActions.loadProfileFailure),
      tap(() => {
        void router.navigateByUrl('/');
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
