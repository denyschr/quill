import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <div class="container-fluid py-2">
      <h1 class="text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a class="btn btn-primary" routerLink="/">Go Home</a>
    </div>
  `,
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
