import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TagService } from '@shared/data-access/services/tag';
import { popularTagsActions } from './popular-tags.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const getArticlesEffect = createEffect(
  (actions$ = inject(Actions), tagService = inject(TagService)) => {
    return actions$.pipe(
      ofType(popularTagsActions.getPopularTags),
      switchMap(() =>
        tagService.getList().pipe(
          map(tags => popularTagsActions.getPopularTagsSuccess({ tags })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(popularTagsActions.getPopularTagsFailure({ error: errorResponse.error }))
          )
        )
      )
    );
  },
  { functional: true }
);
