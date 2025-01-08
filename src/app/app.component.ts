/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authActions } from '@auth/data-access/state';
import { Store } from '@ngrx/store';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';

@Component({
  selector: 'ql-root',
  template: `
    <router-outlet />
    <ql-validation-defaults />
  `,
  standalone: true,
  imports: [RouterOutlet, ValidationDefaultsComponent]
})
export class AppComponent {
  constructor(private readonly store: Store) {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
