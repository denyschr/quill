import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <ql-navbar />
    <main class="container mt-3">
      <router-outlet />
    </main>
  `,
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {}
