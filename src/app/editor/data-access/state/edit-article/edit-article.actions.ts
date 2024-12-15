import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article, BackendErrors } from '@shared/data-access/models';

export const editArticleActions = createActionGroup({
  source: 'Edit Article API',
  events: {
    'Get Article': props<{ slug: string }>(),
    'Get Article Success': props<{ article: Article }>(),
    'Get Article Failure': emptyProps(),

    'Edit Article': props<{ slug: string; article: Partial<Article> }>(),
    'Edit Article Success': props<{ updatedArticle: Article }>(),
    'Edit Article Failure': props<{ errors: BackendErrors }>()
  }
});
