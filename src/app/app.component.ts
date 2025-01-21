/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authActions, selectCurrentUser } from '@app/auth/data-access/state';
import { Store } from '@ngrx/store';
import { ValidationDefaultsComponent } from '@app/core/validation';
import { LetDirective } from '@ngrx/component';
import { filter } from 'rxjs';
import { NavbarComponent } from '@app/core/layout';

@Component({
  selector: 'ql-root',
  template: `
    <ng-container *ngrxLet="currentUser$; let currentUser">
      <header class="fixed-top">
        <ql-navbar [currentUser]="currentUser" />
      </header>
      <main class="mt-5">
        <router-outlet />
      </main>
    </ng-container>
    <ql-validation-defaults />
  `,
  standalone: true,
  imports: [RouterOutlet, ValidationDefaultsComponent, LetDirective, NavbarComponent]
})
export class AppComponent {
  public readonly currentUser$ = this.store
    .select(selectCurrentUser)
    .pipe(filter(currentUser => currentUser !== undefined));

  constructor(private readonly store: Store) {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
