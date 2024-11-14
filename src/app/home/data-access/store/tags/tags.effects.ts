import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tagsActions } from './tags.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TagApiClient } from '@shared/data-access/api';

export const getTagsEffect = createEffect(
  (actions$ = inject(Actions), tagService = inject(TagApiClient)) => {
    return actions$.pipe(
      ofType(tagsActions.getTags),
      switchMap(() =>
        tagService.getAll().pipe(
          map(tags => tagsActions.getTagsSuccess({ tags })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(tagsActions.getTagsFailure({ error: errorResponse.error }))
          )
        )
      )
    );
  },
  { functional: true }
);
