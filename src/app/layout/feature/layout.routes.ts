import { Route } from '@angular/router';

export const LAYOUT_ROUTES: Route[] = [
  {
    path: 'register',
    loadComponent: () => import('../../auth/feature/register/register.component')
  },
  {
    path: 'login',
    loadComponent: () => import('../../auth/feature/login/login.component')
  },
  {
    path: '',
    loadComponent: () => import('../../home/feature/home.component')
  }
];
