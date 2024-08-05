import { ChangeDetectionStrategy, Component } from '@angular/core';
import MenuComponent from '../ui/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../ui/footer/footer.component';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <ql-menu />
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
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {}
