import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  articleListActions,
  articleListInitialState
} from '@app/articles/data-access/state/article-list';

export const profileFavoritesResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const username = route.parent!.paramMap.get('username')!;
  const store = inject(Store);

  store.dispatch(
    articleListActions.setConfig({
      config: {
        ...articleListInitialState.config,
        filters: {
          ...articleListInitialState.config.filters,
          favorited: username
        }
      }
    })
  );

  return true;
};
