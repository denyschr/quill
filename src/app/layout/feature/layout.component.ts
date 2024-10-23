import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <ql-navbar />
    <main>
      <router-outlet />
    </main>
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
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {}
