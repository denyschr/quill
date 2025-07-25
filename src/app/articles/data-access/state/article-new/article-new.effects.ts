import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ArticleApiClient } from '../../api';

import { articleNewActions } from './article-new.actions';

export const newArticle$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleNewActions.newArticle),
      mergeMap(({ article }) =>
        articleApiClient.create(article).pipe(
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
      tap(({ article }) => router.navigate(['/article', article.slug]))
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
