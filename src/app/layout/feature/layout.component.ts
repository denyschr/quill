import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <header class="fixed-top">
      <ql-navbar />
    </header>
    <main class="container mt-5">
      <router-outlet />
    </main>
  `,
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {}
