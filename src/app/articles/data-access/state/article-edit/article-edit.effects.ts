import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ArticleApiClient } from '../../api';

import { articleEditActions } from './article-edit.actions';

export const editArticle$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleEditActions.editArticle),
      concatMap(({ slug, article }) =>
        articleApiClient.update(slug, article).pipe(
          map(editedArticle => articleEditActions.editArticleSuccess({ article: editedArticle })),
          catchError(error => of(articleEditActions.editArticleFailure({ errors: error.errors })))
        )
      )
    );
  },
  { functional: true }
);

export const editArticleSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleEditActions.editArticleSuccess),
      tap(({ article }) => router.navigate(['/article', article.slug]))
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
