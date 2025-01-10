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
import { loggedInGuard } from '@auth/data-access/guards';
import { formGuard } from '@shared/data-access/guards';
import { articleResolver } from '@articles/data-access/resolvers';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@home/feature').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@auth/feature/register').then(m => m.RegisterComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '' })]
  },
  {
    path: 'login',
    loadComponent: () => import('@auth/feature/login').then(m => m.LoginComponent),
    canActivate: [loggedInGuard({ loggedIn: false, otherwise: '' })]
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('@articles/feature/article').then(m => m.ArticleComponent),
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
          import('@articles/feature/article-new').then(m => m.ArticleNewComponent),
        providers: [
          provideEffects(articleNewEffects),
          provideState(articleNewFeatureKey, articleNewReducer)
        ],
        canDeactivate: [formGuard]
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('@articles/feature/article-edit').then(m => m.ArticleEditComponent),
        providers: [
          provideEffects(articleEditEffects, articleEffects),
          provideState(articleFeatureKey, articleReducer),
          provideState(articleEditFeatureKey, articleEditReducer)
        ],
        resolve: { articleResolver },
        canDeactivate: [formGuard]
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('@settings/feature').then(m => m.SettingsComponent),
    providers: [provideState(settingsFeatureKey, settingsReducer)],
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })],
    canDeactivate: [formGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('@profile/feature').then(m => m.PROFILE_ROUTES),
    canActivate: [loggedInGuard({ loggedIn: true, otherwise: '/login' })]
  },
  {
    path: '**',
    loadComponent: () => import('@not-found/feature').then(m => m.NotFoundComponent)
  }
];
