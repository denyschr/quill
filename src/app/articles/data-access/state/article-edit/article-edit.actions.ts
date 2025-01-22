import { createActionGroup, props } from '@ngrx/store';
import { BackendErrors } from '@app/core/data-access/models';
import { Article } from '@app/articles/data-access/models';

export const articleEditActions = createActionGroup({
  source: 'Article Edit',
  events: {
    editArticle: props<{ slug: string; article: Partial<Article> }>(),
    editArticleSuccess: props<{ article: Article }>(),
    editArticleFailure: props<{ errors: BackendErrors }>()
  }
});
