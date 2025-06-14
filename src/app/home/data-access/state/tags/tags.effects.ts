import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { TagApiClient } from '../../api';

import { tagsActions } from './tags.actions';

export const loadTags$ = createEffect(
  (actions$ = inject(Actions), tagApiClient = inject(TagApiClient)) => {
    return actions$.pipe(
      ofType(tagsActions.loadTags),
      exhaustMap(() =>
        tagApiClient.getAll().pipe(
          map(tags => tagsActions.loadTagsSuccess({ tags })),
          catchError(() => of(tagsActions.loadTagsFailure()))
        )
      )
    );
  },
  { functional: true }
);
