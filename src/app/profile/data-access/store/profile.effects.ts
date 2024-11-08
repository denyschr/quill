import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { profileActions } from './profile.actions';
import { ProfileService } from '@shared/data-access/api';

export const getProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    return actions$.pipe(
      ofType(profileActions.getProfile),
      switchMap(({ username }) =>
        profileService.get(username).pipe(
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
