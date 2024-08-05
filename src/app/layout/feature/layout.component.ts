import { Component } from '@angular/core';
import MenuComponent from '../ui/menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ql-layout',
  standalone: true,
  template: `
    <ql-menu />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [``],
  imports: [RouterOutlet, MenuComponent],
  providers: []
})
export default class LayoutComponent {}
