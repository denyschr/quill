import { Route } from '@angular/router';
import { loggedInGuard } from '@app/auth/utils';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  articleEffects,
  articleFeatureKey,
  articleReducer
} from '@app/articles/data-access/state/article';
import { articleResolver } from '@app/articles/data-access/resolvers';
import {
  articleNewEffects,
  articleNewFeatureKey,
  articleNewReducer
} from '@app/articles/data-access/state/article-new';
import { unsavedChangesGuard } from '@app/core/utils';
import {
  articleEditEffects,
  articleEditFeatureKey,
  articleEditReducer
} from '@app/articles/data-access/state/article-edit';
import { settingsFeatureKey, settingsReducer } from '@app/settings/data-access/state';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@app/home/feature').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@app/auth/feature/register').then(m => m.RegisterComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '' })]
  },
  {
    path: 'login',
    loadComponent: () => import('@app/auth/feature/login').then(m => m.LoginComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '' })]
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('@app/articles/feature/article').then(m => m.ArticleComponent),
    providers: [provideEffects(articleEffects), provideState(articleFeatureKey, articleReducer)],
    resolve: { articleResolver }
  },
  {
    path: 'editor',
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/articles/feature/article-new').then(m => m.ArticleNewComponent),
        providers: [
          provideEffects(articleNewEffects),
          provideState(articleNewFeatureKey, articleNewReducer)
        ],
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('@app/articles/feature/article-edit').then(m => m.ArticleEditComponent),
        providers: [
          provideEffects(articleEditEffects, articleEffects),
          provideState(articleFeatureKey, articleReducer),
          provideState(articleEditFeatureKey, articleEditReducer)
        ],
        resolve: { articleResolver },
        canDeactivate: [unsavedChangesGuard]
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('@app/settings/feature').then(m => m.SettingsComponent),
    providers: [provideState(settingsFeatureKey, settingsReducer)],
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('@app/profile/feature').then(m => m.PROFILE_ROUTES),
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })]
  },
  {
    path: '**',
    loadComponent: () => import('@app/not-found/feature').then(m => m.NotFoundComponent)
  }
];
