import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ArticleListComponent } from '@/app/articles/feature/article-list';

import { profileEffects, profileFeatureKey, profileReducer } from '../data-access/state';
import { profileResolver } from './profile.resolver';
import { profileArticlesResolver } from './profile-articles.resolver';
import { profileFavoritesResolver } from './profile-favorites.resolver';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTES: Route[] = [
  {
    path: ':username',
    component: ProfileComponent,
    providers: [provideState(profileFeatureKey, profileReducer), provideEffects(profileEffects)],
    resolve: { profileResolver },
    children: [
      {
        path: '',
        component: ArticleListComponent,
        resolve: { profileArticlesResolver }
      },
      {
        path: 'favorites',
        component: ArticleListComponent,
        resolve: { profileFavoritesResolver }
      }
    ]
  }
];
