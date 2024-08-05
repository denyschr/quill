import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ql-footer',
  standalone: true,
  template: `
    <footer class="py-3 bg-body-secondary">
      <div class="container d-flex flex-column justify-content-center align-items-center gap-2">
        <a class="logo-title text-decoration-none fw-bold text-success" routerLink="/">Quill</a>
        <small class="text-body-tertiary">©2024. Code licensed under MIT.</small>
      </div>
    </footer>
  `,
  styles: [
    `
      .logo-title:hover {
        text-decoration: underline !important;
      }
    `
  ],
  imports: [RouterLink],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
