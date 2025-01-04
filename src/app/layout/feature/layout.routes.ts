import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  articleEffects,
  articleFeatureKey,
  articleReducer
} from '@articles/data-access/state/article';
import { settingsFeatureKey, settingsReducer } from '@settings/data-access/state';
import {
  articleNewEffects,
  articleNewFeatureKey,
  articleNewReducer
} from '@articles/data-access/state/article-new';
import {
  articleEditEffects,
  articleEditFeatureKey,
  articleEditReducer
} from '@articles/data-access/state/article-edit';
import { profileEffects, profileFeatureKey, profileReducer } from '@profile/data-access/state';

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
    children: [
      {
        path: '',
        loadComponent: () => import('../../articles/feature/article-new/article-new.component'),
        providers: [
          provideEffects(articleNewEffects),
          provideState(articleNewFeatureKey, articleNewReducer)
        ]
      },
      {
        path: ':slug',
        loadComponent: () => import('../../articles/feature/article-edit/article-edit.component'),
        providers: [
          provideEffects(articleEditEffects, articleEffects),
          provideState(articleFeatureKey, articleReducer),
          provideState(articleEditFeatureKey, articleEditReducer)
        ]
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('../../settings/feature/settings.component'),
    providers: [provideState(settingsFeatureKey, settingsReducer)]
  },
  {
    path: 'profile/:username',
    loadChildren: () => import('../../profile/feature/profile.routes').then(m => m.PROFILE_ROUTES),
    providers: [provideEffects(profileEffects), provideState(profileFeatureKey, profileReducer)]
  }
];
