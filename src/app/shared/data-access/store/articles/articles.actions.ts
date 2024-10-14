import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ArticleListConfigModel,
  ArticleListResponseModel,
  ArticleModel
} from '@shared/data-access/models';

export const articlesActions = createActionGroup({
  source: 'Articles API',
  events: {
    'Get Articles': props<{ config: ArticleListConfigModel }>(),
    'Get Articles Success': props<{ data: ArticleListResponseModel }>(),
    'Get Articles Failure': props<{ error: string }>(),

    'Add To Favorites': props<{ favorited: boolean; slug: string }>(),
    'Add To Favorites Success': props<{ article: ArticleModel }>(),
    'Add To Favorites Failure': emptyProps()
  }
});
