import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArticleService } from '@shared/data-access/services/article';
import { articlesActions } from './articles.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const getArticlesEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(articlesActions.getArticles),
      switchMap(({ config }) =>
        articleService.getAll(config).pipe(
          map(data => articlesActions.getArticlesSuccess({ data })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(articlesActions.getArticlesFailure({ error: errorResponse.error }))
          )
        )
      )
    );
  },
  { functional: true }
);
