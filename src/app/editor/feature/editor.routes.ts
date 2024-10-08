import { Route } from '@angular/router';

export const editorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./new-article/new-article.component')
  }
  // TODO: add one more route for editing article
];
