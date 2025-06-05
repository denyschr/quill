import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';

import { ArticleApiClient } from '../../api';

import { articleListActions } from './article-list.actions';
import { selectConfig } from './article-list.state';

export const setPage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(articleListActions.setPage),
      map(() => articleListActions.loadArticles())
    );
  },
  { functional: true }
);

export const setConfig$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(articleListActions.setConfig),
      map(() => articleListActions.loadArticles())
    );
  },
  { functional: true }
);

export const loadArticles$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    articleApiClient = inject(ArticleApiClient)
  ) => {
    return actions$.pipe(
      ofType(articleListActions.loadArticles),
      concatLatestFrom(() => store.select(selectConfig)),
      exhaustMap(([_, config]) =>
        articleApiClient.getAll(config).pipe(
          map(({ articles, articlesCount }) =>
            articleListActions.loadArticlesSuccess({
              articles,
              total: articlesCount
            })
          )
        )
      ),
      catchError(() => of(articleListActions.loadArticlesFailure()))
    );
  },
  { functional: true }
);

export const favorite$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleListActions.favorite),
      concatMap(({ slug }) => {
        return articleApiClient.favorite(slug).pipe(
          map(article => articleListActions.favoriteSuccess({ article })),
          catchError(() => of(articleListActions.favoriteFailure()))
        );
      })
    );
  },
  { functional: true }
);

export const unfavorite$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleListActions.unfavorite),
      concatMap(({ slug }) => {
        return articleApiClient.unfavorite(slug).pipe(
          map(article => articleListActions.unfavoriteSuccess({ article })),
          catchError(() => of(articleListActions.unfavoriteFailure()))
        );
      })
    );
  },
  { functional: true }
);
