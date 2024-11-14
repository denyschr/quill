import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { editArticleActions } from './edit-article.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticleApiClient } from '@shared/data-access/api';

export const getArticleEffect = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(editArticleActions.getArticle),
      switchMap(({ slug }) =>
        articleApiClient.get(slug).pipe(
          map(article => editArticleActions.getArticleSuccess({ article })),
          catchError(() => {
            return of(editArticleActions.getArticleFailure());
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
      ofType(editArticleActions.getArticleFailure),
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

export const editArticleEffect = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(editArticleActions.editArticle),
      switchMap(({ slug, article }) =>
        articleApiClient.update(slug, article).pipe(
          map(updatedArticle => editArticleActions.editArticleSuccess({ updatedArticle })),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              editArticleActions.editArticleFailure({ errors: errorResponse.error.errors })
            );
          })
        )
      )
    );
  },
  { functional: true }
);

export const redirectAfterEditEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(editArticleActions.editArticleSuccess),
      tap(({ updatedArticle }) => {
        router.navigate(['/article', updatedArticle.slug]);
      })
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
