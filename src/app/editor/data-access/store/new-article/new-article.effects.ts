import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArticleService } from '@shared/data-access/services/article';
import { newArticleActions } from './new-article.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export const newArticleEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(newArticleActions.newArticle),
      switchMap(({ article }) =>
        articleService.create(article).pipe(
          map(createdArticle => newArticleActions.newArticleSuccess({ createdArticle })),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(newArticleActions.newArticleFailure({ errors: errorResponse.error.errors }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterNewEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(newArticleActions.newArticleSuccess),
      tap(({ createdArticle }) => {
        router.navigate(['/article', createdArticle.slug]);
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
