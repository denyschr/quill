import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';

import { ProfileApiClient } from '../api';

import { profileActions } from './profile.actions';

export const loadProfile$ = createEffect(
  (actions$ = inject(Actions), profileApiClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(profileActions.loadProfile),
      switchMap(({ username }) =>
        profileApiClient.get(username).pipe(
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
        router.navigateByUrl('/');
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);

export const follow$ = createEffect(
  (actions$ = inject(Actions), profileClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(profileActions.follow),
      concatMap(({ username }) => {
        return profileClient.follow(username).pipe(
          map(profile => profileActions.followSuccess({ profile })),
          catchError(() => of(profileActions.followFailure()))
        );
      })
    );
  },
  { functional: true }
);

export const unfollow$ = createEffect(
  (actions$ = inject(Actions), profileClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(profileActions.unfollow),
      concatMap(({ username }) => {
        return profileClient.unfollow(username).pipe(
          map(profile => profileActions.unfollowSuccess({ profile })),
          catchError(() => of(profileActions.unfollowFailure()))
        );
      })
    );
  },
  { functional: true }
);
