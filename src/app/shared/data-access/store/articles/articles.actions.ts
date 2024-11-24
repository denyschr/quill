import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article, ArticleListConfig } from '@shared/data-access/models';

export const articlesActions = createActionGroup({
  source: 'Articles API',
  events: {
    'Set Page': props<{ page: number }>(),
    'Set Config': props<{ config: ArticleListConfig }>(),

    'Load Articles': emptyProps(),
    'Load Articles Success': props<{ articles: Article[]; articlesCount: number }>(),
    'Load Articles Failure': emptyProps(),

    'Add To Favorites': props<{ favorited: boolean; slug: string }>(),
    'Add To Favorites Success': props<{ article: Article }>(),
    'Add To Favorites Failure': emptyProps()
  }
});
