import { createActionGroup, props } from '@ngrx/store';
import { BackendErrors } from '@app/core/data-access/models';
import { Article } from '@app/articles/data-access/models';

export const articleNewActions = createActionGroup({
  source: 'Article New API',
  events: {
    newArticle: props<{ article: Partial<Article> }>(),
    newArticleSuccess: props<{ article: Article }>(),
    newArticleFailure: props<{ errors: BackendErrors }>()
  }
});
