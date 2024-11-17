import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tagsActions } from './tags.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { TagApiClient } from '@shared/data-access/api';

export const getTags = createEffect(
  (actions$ = inject(Actions), tagApiClient = inject(TagApiClient)) => {
    return actions$.pipe(
      ofType(tagsActions.getTags),
      switchMap(() =>
        tagApiClient.getAll().pipe(
          map(tags => tagsActions.getTagsSuccess({ tags })),
          catchError(() => of(tagsActions.getTagsFailure()))
        )
      )
    );
  },
  { functional: true }
);
