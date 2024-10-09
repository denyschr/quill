import { Route } from '@angular/router';
import { newArticleFeatureKey, newArticleReducer } from '@editor/data-access/store/new-article';
import * as newArticleEffects from '@editor/data-access/store/new-article/new-article.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const editorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./new-article/new-article.component'),
    providers: [
      provideEffects(newArticleEffects),
      provideState(newArticleFeatureKey, newArticleReducer)
    ]
  }
  // TODO: add one more route for editing article
];
