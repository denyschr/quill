import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article } from '@shared/data-access/models';

export const articleActions = createActionGroup({
  source: 'Article API',
  events: {
    loadArticle: props<{ slug: string }>(),
    loadArticleSuccess: props<{ article: Article }>(),
    loadArticleFailure: emptyProps(),

    deleteArticle: props<{ slug: string }>(),
    deleteArticleSuccess: emptyProps(),
    deleteArticleFailure: emptyProps()
  }
});
