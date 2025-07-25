import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ProfileApiClient } from '@/app/profile/data-access/api';

import { ArticleApiClient } from '../../api';

import { articleDetailActions } from './article-detail.actions';

export const loadArticle$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleDetailActions.loadArticle),
      concatMap(({ slug }) =>
        articleApiClient.get(slug).pipe(
          map(article => articleDetailActions.loadArticleSuccess({ article })),
          catchError(() => of(articleDetailActions.loadArticleFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const loadArticleFailure$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleDetailActions.loadArticleFailure),
      tap(() => router.navigateByUrl('/'))
    );
  },
  {
    functional: true,
    dispatch: false
  }
);

export const follow$ = createEffect(
  (actions$ = inject(Actions), profileApiClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(articleDetailActions.follow),
      concatMap(({ username }) =>
        profileApiClient.follow(username).pipe(
          map(profile => articleDetailActions.followSuccess({ profile })),
          catchError(() => of(articleDetailActions.followFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const unfollow$ = createEffect(
  (actions$ = inject(Actions), profileApiClient = inject(ProfileApiClient)) => {
    return actions$.pipe(
      ofType(articleDetailActions.unfollow),
      concatMap(({ username }) =>
        profileApiClient.unfollow(username).pipe(
          map(profile => articleDetailActions.unfollowSuccess({ profile })),
          catchError(() => of(articleDetailActions.unfollowFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const deleteArticle$ = createEffect(
  (actions$ = inject(Actions), articleApiClient = inject(ArticleApiClient)) => {
    return actions$.pipe(
      ofType(articleDetailActions.deleteArticle),
      mergeMap(({ slug }) =>
        articleApiClient.delete(slug).pipe(
          map(() => articleDetailActions.deleteArticleSuccess()),
          catchError(() => of(articleDetailActions.deleteArticleFailure()))
        )
      )
    );
  },
  { functional: true }
);

export const deleteArticleSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(articleDetailActions.deleteArticleSuccess),
      tap(() => router.navigateByUrl('/'))
    );
  },
  {
    functional: true,
    dispatch: false
  }
);
