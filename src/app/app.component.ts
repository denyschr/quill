/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authActions } from '@app/auth/data-access/state';
import { Store } from '@ngrx/store';
import { ValidationDefaultsComponent } from '@app/core/validation';
import { NavbarComponent } from '@app/core/layout';

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
