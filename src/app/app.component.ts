/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authActions } from '@auth/data-access/store';
import { Store } from '@ngrx/store';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';

@Component({
  selector: 'ql-root',
  standalone: true,
  template: `
    <router-outlet />
    <ql-validation-defaults />
  `,
  styles: [``],
  imports: [RouterOutlet, ValidationDefaultsComponent],
  providers: []
})
export class AppComponent implements OnInit {
  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
