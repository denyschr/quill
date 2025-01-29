import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { articleDetailActions } from '@app/articles/data-access/state/article-detail';

export const articleDetailResolver: ResolveFn<boolean> = route => {
  const store = inject(Store);
  const slug = route.paramMap.get('slug')!;
  store.dispatch(articleDetailActions.loadArticle({ slug }));
  return true;
};
