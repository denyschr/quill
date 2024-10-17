import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./profile.component')
  },
  {
    path: 'favorites',
    loadComponent: () => import('./profile.component')
  }
];
