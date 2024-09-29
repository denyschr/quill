import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TagService } from '@shared/data-access/services/tag';
import { tagsActions } from './tags.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const getTagsEffect = createEffect(
  (actions$ = inject(Actions), tagService = inject(TagService)) => {
    return actions$.pipe(
      ofType(tagsActions.getTags),
      switchMap(() =>
        tagService.getList().pipe(
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
