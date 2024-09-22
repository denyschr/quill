import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { authFeatureKey, authReducer } from '@auth/data-access/store';
import * as authEffects from '@auth/data-access/store/auth.effects';
import * as articlesEffects from '@shared/data-access/store/articles/articles.effects';
import * as popularTagsEffects from '@home/data-access/store/popular-tags/popular-tags.effects';
import { apiInterceptor, tokenInterceptor } from '@auth/utils';
import { articlesFeatureKey, articlesReducer } from '@shared/data-access/store/articles';
import { popularTagsFeatureKey, popularTagsReducer } from '@home/data-access/store/popular-tags';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([apiInterceptor, tokenInterceptor])),
    provideAnimationsAsync(),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(authFeatureKey, authReducer),
    provideState(articlesFeatureKey, articlesReducer),
    provideState(popularTagsFeatureKey, popularTagsReducer),
    provideEffects(authEffects, articlesEffects, popularTagsEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
