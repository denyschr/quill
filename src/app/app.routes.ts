import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('@app/layout/feature').then(m => m.LayoutComponent),
    loadChildren: () => import('@app/layout/feature').then(m => m.LAYOUT_ROUTES)
  }
];
