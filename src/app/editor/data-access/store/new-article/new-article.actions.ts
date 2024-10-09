import { createActionGroup, props } from '@ngrx/store';
import { ArticleModel, BackendErrorsModel } from '@shared/data-access/models';

export const newArticleActions = createActionGroup({
  source: 'New Article API',
  events: {
    'New Article': props<{ article: Partial<ArticleModel> }>(),
    'New Article Success': props<{ createdArticle: ArticleModel }>(),
    'New Article Failure': props<{ errors: BackendErrorsModel }>()
  }
});
