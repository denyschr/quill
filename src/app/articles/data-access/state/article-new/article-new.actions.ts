import { createActionGroup, props } from '@ngrx/store';
import { Article, BackendErrors } from '@app/shared/data-access/api/models';

export const articleNewActions = createActionGroup({
  source: 'Article New API',
  events: {
    newArticle: props<{ article: Partial<Article> }>(),
    newArticleSuccess: props<{ article: Article }>(),
    newArticleFailure: props<{ errors: BackendErrors }>()
  }
});
