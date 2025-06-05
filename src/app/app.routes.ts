import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  articleEditEffects,
  articleEditFeatureKey,
  articleEditReducer
} from './articles/data-access/state/article-edit';
import { loggedInGuard } from './auth/utils';
import {
  articleDetailEffects,
  articleDetailFeatureKey,
  articleDetailReducer
} from './articles/data-access/state/article-detail';
import { articleDetailResolver } from './articles/feature/article-detail';
import {
  articleNewEffects,
  articleNewFeatureKey,
  articleNewReducer
} from './articles/data-access/state/article-new';
import { settingsFeatureKey, settingsReducer } from './settings/data-access/state';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/feature').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/feature/register').then(m => m.RegisterComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '/' })]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/feature/login').then(m => m.LoginComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '/' })]
  },
  {
    path: 'article/:slug',
    loadComponent: () =>
      import('./articles/feature/article-detail').then(m => m.ArticleDetailComponent),
    providers: [
      provideEffects(articleDetailEffects),
      provideState(articleDetailFeatureKey, articleDetailReducer)
    ],
    resolve: { articleDetailResolver }
  },
  {
    path: 'editor',
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./articles/feature/article-new').then(m => m.ArticleNewComponent),
        providers: [
          provideEffects(articleNewEffects),
          provideState(articleNewFeatureKey, articleNewReducer)
        ]
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./articles/feature/article-edit').then(m => m.ArticleEditComponent),
        providers: [
          provideEffects(articleEditEffects, articleDetailEffects),
          provideState(articleDetailFeatureKey, articleDetailReducer),
          provideState(articleEditFeatureKey, articleEditReducer)
        ],
        resolve: { articleDetailResolver }
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/feature').then(m => m.SettingsComponent),
    providers: [provideState(settingsFeatureKey, settingsReducer)],
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/feature').then(m => m.PROFILE_ROUTES),
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/ui/not-found').then(m => m.NotFoundComponent)
  }
];
