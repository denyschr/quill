import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article, ArticleListConfig } from '@shared/data-access/models';

export const articleListActions = createActionGroup({
  source: 'Article List API',
  events: {
    setPage: props<{ page: number }>(),
    setConfig: props<{ config: ArticleListConfig }>(),

    loadArticles: emptyProps(),
    loadArticlesSuccess: props<{ articles: Article[]; total: number }>(),
    loadArticlesFailure: emptyProps(),

    favorite: props<{ favorited: boolean; slug: string }>(),
    favoriteSuccess: props<{ article: Article }>(),
    favoriteFailure: emptyProps()
  }
});
