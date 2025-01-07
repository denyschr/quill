import { CanActivateFn, Route, Router } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, Store } from '@ngrx/store';
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
import { inject } from '@angular/core';
import { selectCurrentUser } from '@auth/data-access/state';
import { filter, map } from 'rxjs';

export const authenticationGuard = (options: {
  readonly authenticated: boolean;
  readonly otherwise: string;
}): CanActivateFn => {
  const { authenticated, otherwise } = options;
  return () => {
    const router = inject(Router);
    const store = inject(Store);
    return store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== undefined),
      map(currentUser => !!currentUser === authenticated || router.parseUrl(otherwise))
    );
  };
};

export const LAYOUT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@home/feature').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@auth/feature/register').then(m => m.RegisterComponent),
    canActivate: [authenticationGuard({ authenticated: false, otherwise: '' })]
  },
  {
    path: 'login',
    loadComponent: () => import('@auth/feature/login').then(m => m.LoginComponent),
    canActivate: [authenticationGuard({ authenticated: false, otherwise: '' })]
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('@articles/feature/article').then(m => m.ArticleComponent),
    providers: [provideEffects(articleEffects), provideState(articleFeatureKey, articleReducer)]
  },
  {
    path: 'editor',
    canActivate: [authenticationGuard({ authenticated: true, otherwise: '/login' })],
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
    providers: [provideState(settingsFeatureKey, settingsReducer)],
    canActivate: [authenticationGuard({ authenticated: true, otherwise: '/login' })]
  },
  {
    path: 'profile',
    loadChildren: () => import('@profile/feature').then(m => m.PROFILE_ROUTES),
    canActivate: [authenticationGuard({ authenticated: true, otherwise: '/login' })]
  }
];
