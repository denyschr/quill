import { createActionGroup, props } from '@ngrx/store';
import { Article, BackendErrors } from '@shared/data-access/models';

export const articleNewActions = createActionGroup({
  source: 'Article New API',
  events: {
    newArticle: props<{ article: Partial<Article> }>(),
    newArticleSuccess: props<{ article: Article }>(),
    newArticleFailure: props<{ errors: BackendErrors }>()
  }
});
