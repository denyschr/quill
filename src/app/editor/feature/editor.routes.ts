import { Route } from '@angular/router';
import { newArticleFeatureKey, newArticleReducer } from '@editor/data-access/store/new-article';
import * as newArticleEffects from '@editor/data-access/store/new-article/new-article.effects';
import * as editArticleEffects from '@editor/data-access/store/edit-article/edit-article.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { editArticleFeatureKey, editArticleReducer } from '@editor/data-access/store/edit-article';

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
