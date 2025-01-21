import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tagsActions } from './tags.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { TagApiClient } from '@app/shared/data-access/api/services';

export const loadTags$ = createEffect(
  (actions$ = inject(Actions), tagClient = inject(TagApiClient)) => {
    return actions$.pipe(
      ofType(tagsActions.loadTags),
      exhaustMap(() =>
        tagClient.getAll().pipe(
          map(tags => tagsActions.loadTagsSuccess({ tags })),
          catchError(() => of(tagsActions.loadTagsFailure()))
        )
      )
    );
  },
  { functional: true }
);
