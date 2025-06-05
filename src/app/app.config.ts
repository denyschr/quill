import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { authEffects, authFeatureKey, authReducer } from './auth/data-access/state';
import { tagsEffects, tagsFeatureKey, tagsReducer } from './home/data-access/state/tags';
import { apiInterceptor, errorInterceptor, tokenInterceptor } from './core/utils';
import {
  articleListEffects,
  articleListFeatureKey,
  articleListReducer
} from './articles/data-access/state/article-list';

import { APP_ROUTES } from './app.routes';

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiInterceptor, tokenInterceptor, errorInterceptor])),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(authFeatureKey, authReducer),
    provideState(articleListFeatureKey, articleListReducer),
    provideState(tagsFeatureKey, tagsReducer),
    provideEffects(authEffects, articleListEffects, tagsEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
