import { createActionGroup, props } from '@ngrx/store';
import { Article, BackendErrors } from '@app/shared/data-access/api/models';

export const articleEditActions = createActionGroup({
  source: 'Article Edit API',
  events: {
    editArticle: props<{ slug: string; article: Partial<Article> }>(),
    editArticleSuccess: props<{ article: Article }>(),
    editArticleFailure: props<{ errors: BackendErrors }>()
  }
});
