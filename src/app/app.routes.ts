import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/feature/layout.component'),
    loadChildren: () => import('./layout/feature/layout.routes').then(m => m.LAYOUT_ROUTES)
  }
];
