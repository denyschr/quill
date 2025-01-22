import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { articleEditActions } from './article-edit.actions';
import { ArticleApiClient } from '@app/articles/data-access/services';

export const editArticle$ = createEffect(
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleEditActions.editArticle),
      concatMap(({ slug, article }) =>
        articleClient.update(slug, article).pipe(
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
