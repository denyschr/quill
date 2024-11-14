import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { articlesActions } from './articles.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticleApiClient } from '@shared/data-access/api';

export const getArticlesEffect = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articlesActions.getArticles),
      switchMap(({ config }) =>
        articleApiClient.getAll(config).pipe(
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

export const addToFavoritesEffect = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articlesActions.addToFavorites),
      switchMap(({ favorited, slug }) => {
        const article$ = favorited
          ? articleApiClient.unfavorite(slug)
          : articleApiClient.favorite(slug);

        return article$.pipe(
          map(article => articlesActions.addToFavoritesSuccess({ article })),
          catchError(() => of(articlesActions.addToFavoritesFailure()))
        );
      })
    );
  },
  { functional: true }
);
