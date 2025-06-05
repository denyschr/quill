import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { authActions } from './auth/data-access/state';
import { ValidationDefaultsComponent } from './core/validation';
import { NavbarComponent } from './core/layout';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'ql-root',
  template: `
    <ql-navbar />
    <main class="mt-5">
      <router-outlet />
    </main>
    <ql-validation-defaults />
  `,
  standalone: true,
  imports: [RouterOutlet, ValidationDefaultsComponent, NavbarComponent]
})
export class AppComponent {
  constructor(private readonly store: Store) {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
