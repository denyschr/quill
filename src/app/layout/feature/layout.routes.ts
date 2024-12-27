import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  articleEffects,
  articleFeatureKey,
  articleReducer
} from '@articles/data-access/state/article';
import { settingsFeatureKey, settingsReducer } from '@settings/data-access/state';

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
    loadComponent: () => import('../../articles/feature/article/article.component'),
    providers: [provideEffects(articleEffects), provideState(articleFeatureKey, articleReducer)]
  },
  {
    path: 'editor',
    loadChildren: () => import('../../editor/feature/editor.routes').then(m => m.editorRoutes)
  },
  {
    path: 'settings',
    loadComponent: () => import('../../settings/feature/settings.component'),
    providers: [provideState(settingsFeatureKey, settingsReducer)]
  }
  // {
  //   path: 'profile/:username',
  //   loadChildren: () => import('../../profile/feature/profile.routes').then(m => m.profileRoutes),
  //   providers: [provideState(profileFeatureKey, profileReducer), provideEffects(profileEffects)]
  // }
];
