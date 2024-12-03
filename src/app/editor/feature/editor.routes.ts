import { Route } from '@angular/router';
import {
  newArticleEffects,
  newArticleFeatureKey,
  newArticleReducer
} from '@editor/data-access/state/new-article';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  editArticleEffects,
  editArticleFeatureKey,
  editArticleReducer
} from '@editor/data-access/state/edit-article';

export const editorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./new-article/new-article.component'),
    providers: [
      provideEffects(newArticleEffects),
      provideState(newArticleFeatureKey, newArticleReducer)
    ]
  },
  {
    path: ':slug',
    loadComponent: () => import('./edit-article/edit-article.component'),
    providers: [
      provideEffects(editArticleEffects),
      provideState(editArticleFeatureKey, editArticleReducer)
    ]
  }
];
