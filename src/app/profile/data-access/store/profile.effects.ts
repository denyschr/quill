import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { profileActions } from './profile.actions';
import { ProfileApiClient } from '@shared/data-access/api';

export const getProfileEffect = createEffect(
  (actions$ = inject(Actions), profileApiClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(profileActions.getProfile),
      switchMap(({ username }) =>
        profileApiClient.get(username).pipe(
          map(profile => profileActions.getProfileSuccess({ profile })),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(profileActions.getProfileFailure({ error: errorResponse.error }));
          })
        )
      )
    );
  },
  { functional: true }
);
