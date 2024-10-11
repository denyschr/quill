import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ArticleModel, BackendErrorsModel } from '@shared/data-access/models';

export const editArticleActions = createActionGroup({
  source: 'Edit Article API',
  events: {
    'Get Article': props<{ slug: string }>(),
    'Get Article Success': props<{ article: ArticleModel }>(),
    'Get Article Failure': emptyProps(),

    'Edit Article': props<{ slug: string; article: Partial<ArticleModel> }>(),
    'Edit Article Success': props<{ updatedArticle: ArticleModel }>(),
    'Edit Article Failure': props<{ errors: BackendErrorsModel }>()
  }
});
