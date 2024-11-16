import { createActionGroup, props } from '@ngrx/store';
import { Article, BackendErrors } from '@shared/data-access/models';

export const newArticleActions = createActionGroup({
  source: 'New Article API',
  events: {
    'New Article': props<{ article: Partial<Article> }>(),
    'New Article Success': props<{ createdArticle: Article }>(),
    'New Article Failure': props<{ errors: BackendErrors }>()
  }
});
