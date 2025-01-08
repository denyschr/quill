import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { articleActions } from '@articles/data-access/state/article';

export const articleResolver: ResolveFn<boolean> = route => {
  const store = inject(Store);
  const slug = route.paramMap.get('slug')!;

  store.dispatch(articleActions.loadArticle({ slug }));

  return true;
};
