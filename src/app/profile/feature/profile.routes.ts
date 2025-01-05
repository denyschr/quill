import { Route } from '@angular/router';
import ProfileComponent from './profile.component';
import { provideState } from '@ngrx/store';
import { profileEffects, profileFeatureKey, profileReducer } from '@profile/data-access/state';
import { provideEffects } from '@ngrx/effects';
import {
  profileArticlesResolver,
  profileFavoritesResolver,
  profileResolver
} from '@profile/data-access/resolvers';

export const PROFILE_ROUTES: Route[] = [
  {
    path: ':username',
    component: ProfileComponent,
    providers: [provideState(profileFeatureKey, profileReducer), provideEffects(profileEffects)],
    resolve: { profileResolver },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../articles/feature/article-list/article-list.component').then(
            m => m.ArticleListComponent
          ),
        resolve: { profileArticlesResolver }
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../../articles/feature/article-list/article-list.component').then(
            m => m.ArticleListComponent
          ),
        resolve: { profileFavoritesResolver }
      }
    ]
  }
];
