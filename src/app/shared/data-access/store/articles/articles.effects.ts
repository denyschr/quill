import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { articlesActions } from './articles.actions';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';
import { ArticleApiClient } from '@shared/data-access/api';
import { Store } from '@ngrx/store';
import { selectConfig } from '@shared/data-access/store/articles/articles.state';
import { concatLatestFrom } from '@ngrx/operators';

export const setPage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(articlesActions.setPage),
      map(() => articlesActions.loadArticles())
    );
  },
  { functional: true }
);

export const setConfig$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(articlesActions.setConfig),
      map(() => articlesActions.loadArticles())
    );
  },
  { functional: true }
);

export const loadArticles$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articlesActions.loadArticles),
      concatLatestFrom(() => store.select(selectConfig)),
      concatMap(([_, config]) =>
        articleClient.getAll(config).pipe(
          map(({ articles, articlesCount }) =>
            articlesActions.loadArticlesSuccess({
              articles,
              articlesCount
            })
          )
        )
      ),
      catchError(() => of(articlesActions.loadArticlesFailure()))
    );
  },
  { functional: true }
);

export const addToFavorites$ = createEffect(
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articlesActions.addToFavorites),
      switchMap(({ favorited, slug }) => {
        const article$ = favorited ? articleClient.unfavorite(slug) : articleClient.favorite(slug);

        return article$.pipe(
          map(article => articlesActions.addToFavoritesSuccess({ article })),
          catchError(() => of(articlesActions.addToFavoritesFailure()))
        );
      })
    );
  },
  { functional: true }
);
