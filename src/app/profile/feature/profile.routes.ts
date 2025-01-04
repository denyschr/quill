import { Route } from '@angular/router';

export const PROFILE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./profile.component')
  },
  {
    path: 'favorites',
    loadComponent: () => import('./profile.component')
  }
];
