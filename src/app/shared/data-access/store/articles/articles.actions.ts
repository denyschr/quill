import { createActionGroup, props } from '@ngrx/store';
import { ArticleListConfigModel, ArticleListResponseModel } from '@shared/data-access/models';

export const articlesActions = createActionGroup({
  source: 'Articles API',
  events: {
    'Get Articles': props<{ config: ArticleListConfigModel }>(),
    'Get Articles Success': props<{ data: ArticleListResponseModel }>(),
    'Get Articles Failure': props<{ error: string }>()
  }
});
