import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { articleActions } from './article.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ArticleService } from '@shared/data-access/api';

export const getArticleEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(articleActions.getArticle),
      switchMap(({ slug }) =>
        articleService.get(slug).pipe(
          map(article => articleActions.getArticleSuccess({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(articleActions.getArticleFailure({ error: errorResponse.error }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterFailureEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleActions.getArticleFailure),
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

export const deleteArticleEffect = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(articleActions.deleteArticle),
      switchMap(({ slug }) =>
        articleService.delete(slug).pipe(
          map(() => articleActions.deleteArticleSuccess()),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(articleActions.deleteArticleFailure({ error: errorResponse.error }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterDeleteEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleActions.deleteArticleSuccess),
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
