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

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@home/feature').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@auth/feature/register').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('@auth/feature/login').then(m => m.LoginComponent)
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('@articles/feature/article').then(m => m.ArticleComponent),
    providers: [provideEffects(articleEffects), provideState(articleFeatureKey, articleReducer)]
  },
  {
    path: 'editor',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@articles/feature/article-new').then(m => m.ArticleNewComponent),
        providers: [
          provideEffects(articleNewEffects),
          provideState(articleNewFeatureKey, articleNewReducer)
        ]
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('@articles/feature/article-edit').then(m => m.ArticleEditComponent),
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
    loadComponent: () => import('@settings/feature').then(m => m.SettingsComponent),
    providers: [provideState(settingsFeatureKey, settingsReducer)]
  },
  {
    path: 'profile',
    loadChildren: () => import('@profile/feature').then(m => m.PROFILE_ROUTES)
  }
];
