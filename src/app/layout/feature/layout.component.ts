import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';
import { FooterComponent } from '@layout/ui/footer';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <ql-navbar />
    <main class="flex-grow-1">
      <router-outlet />
    </main>
    <ql-footer />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        overflow: clip;
      }
    `
  ],
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {}
