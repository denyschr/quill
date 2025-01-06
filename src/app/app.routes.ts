import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@layout/feature').then(m => m.LayoutComponent),
    loadChildren: () => import('@layout/feature').then(m => m.LAYOUT_ROUTES)
  }
];
