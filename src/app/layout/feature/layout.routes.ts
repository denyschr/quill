import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import * as articleEffects from '@article/data-access/store/article.effects';
import { provideState } from '@ngrx/store';
import { articleFeatureKey, articleReducer } from '@article/data-access/store';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('../../home/feature/home.component')
  },
  {
    path: 'register',
    loadComponent: () => import('../../auth/feature/register/register.component')
  },
  {
    path: 'login',
    loadComponent: () => import('../../auth/feature/login/login.component')
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('../../article/feature/article.component'),
    providers: [provideEffects(articleEffects), provideState(articleFeatureKey, articleReducer)]
  },
  {
    path: 'editor',
    loadChildren: () => import('../../editor/feature/editor.routes').then(m => m.editorRoutes)
  }
];
