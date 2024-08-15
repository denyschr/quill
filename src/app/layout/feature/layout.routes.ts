import { Route } from '@angular/router';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: 'register',
    loadComponent: () => import('../../auth/feature/register/register.component')
  }
];
