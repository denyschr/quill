import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { articleListActions } from './article-list.actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { ArticleApiClient } from '@shared/data-access/api';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
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
  (actions$ = inject(Actions), store = inject(Store), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleListActions.loadArticles),
      concatLatestFrom(() => store.select(selectConfig)),
      concatMap(([_, config]) =>
        articleClient.getAll(config).pipe(
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
  (actions$ = inject(Actions), articleClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleListActions.favorite),
      concatMap(({ favorited, slug }) => {
        const article$ = favorited ? articleClient.unfavorite(slug) : articleClient.favorite(slug);

        return article$.pipe(
          map(article => articleListActions.favoriteSuccess({ article })),
          catchError(() => of(articleListActions.favoriteFailure()))
        );
      })
    );
  },
  { functional: true }
);
