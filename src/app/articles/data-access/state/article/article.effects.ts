import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { articleActions } from './article.actions';
import { catchError, concatMap, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ArticleApiClient } from '@shared/data-access/api';

export const loadArticle$ = createEffect(
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleActions.loadArticle),
      concatMap(({ slug }) =>
        articleClient.get(slug).pipe(
          map(article => articleActions.loadArticleSuccess({ article })),
          catchError(() => of(articleActions.loadArticleFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const loadArticleFailure$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleActions.loadArticleFailure),
      tap(() => {
        void router.navigateByUrl('/');
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);

export const deleteArticle$ = createEffect(
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleActions.deleteArticle),
      mergeMap(({ slug }) =>
        articleClient.delete(slug).pipe(
          map(() => articleActions.deleteArticleSuccess()),
          catchError(() => of(articleActions.deleteArticleFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const deleteArticleSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleActions.deleteArticleSuccess),
      tap(() => {
        void router.navigateByUrl('/');
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
