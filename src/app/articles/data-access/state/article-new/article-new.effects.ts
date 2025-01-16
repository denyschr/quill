import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ArticleApiClient } from '@shared/data-access/api/services';
import { articleNewActions } from './article-new.actions';

export const newArticle$ = createEffect(
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleNewActions.newArticle),
      mergeMap(({ article }) =>
        articleClient.create(article).pipe(
          map(createdArticle => articleNewActions.newArticleSuccess({ article: createdArticle })),
          catchError(error => of(articleNewActions.newArticleFailure({ errors: error.errors })))
        )
      )
    );
  },
  { functional: true }
);

export const newArticleSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleNewActions.newArticleSuccess),
      tap(({ article }) => {
        void router.navigate(['/article', article.slug]);
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
