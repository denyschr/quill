import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <div class="container-fluid py-5 text-center">
      <h1 data-test="status-code">404</h1>
      <h2 data-test="title">Page Not Found</h2>
      <p data-test="description">The page you are looking for does not exist.</p>
      <a data-test="redirect-link" class="btn btn-primary" routerLink="/">Go Home</a>
    </div>
  `,
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
