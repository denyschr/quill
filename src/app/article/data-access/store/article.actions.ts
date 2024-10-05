import { createActionGroup, props } from '@ngrx/store';
import { ArticleModel } from '@shared/data-access/models';

export const articleActions = createActionGroup({
  source: 'Article API',
  events: {
    'Get Article': props<{ slug: string }>(),
    'Get Article Success': props<{ article: ArticleModel }>(),
    'Get Article Failure': props<{ error: string }>()
  }
});
