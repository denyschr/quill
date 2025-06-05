import { createActionGroup, props } from '@ngrx/store';

import { Article } from '../../models';

import { BackendErrors } from '@/app/core/data-access/models';

export const articleEditActions = createActionGroup({
  source: 'Article Edit',
  events: {
    editArticle: props<{ slug: string; article: Partial<Article> }>(),
    editArticleSuccess: props<{ article: Article }>(),
    editArticleFailure: props<{ errors: BackendErrors }>()
  }
});
