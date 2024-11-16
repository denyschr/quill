import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article, ArticleListConfig, ArticleListResponse } from '@shared/data-access/models';

export const articlesActions = createActionGroup({
  source: 'Articles API',
  events: {
    'Get Articles': props<{ config: ArticleListConfig }>(),
    'Get Articles Success': props<{ data: ArticleListResponse }>(),
    'Get Articles Failure': props<{ error: string }>(),

    'Add To Favorites': props<{ favorited: boolean; slug: string }>(),
    'Add To Favorites Success': props<{ article: Article }>(),
    'Add To Favorites Failure': emptyProps()
  }
});
