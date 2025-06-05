import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Article, ArticleListConfig } from '../../models';

export const articleListActions = createActionGroup({
  source: 'Article List',
  events: {
    setPage: props<{ page: number }>(),
    setConfig: props<{ config: ArticleListConfig }>(),

    loadArticles: emptyProps(),
    loadArticlesSuccess: props<{ articles: Article[]; total: number }>(),
    loadArticlesFailure: emptyProps(),

    favorite: props<{ slug: string }>(),
    favoriteSuccess: props<{ article: Article }>(),
    favoriteFailure: emptyProps(),

    unfavorite: props<{ slug: string }>(),
    unfavoriteSuccess: props<{ article: Article }>(),
    unfavoriteFailure: emptyProps()
  }
});
