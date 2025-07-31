import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';

import { authActions, selectErrors, selectSubmitting } from '../../data-access/state';
import { LoginCredentials } from '../../data-access/models';
import { LoginFormComponent } from '../../ui/login-form';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 text-center">
            <h1 data-test="login-title">Sign in</h1>
            <a data-test="register-link" class="link-opacity-100" routerLink="/register"
              >Don't have an account?</a
            >
          </div>
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.errors) {
              <ql-backend-errors [errors]="vm.errors" />
            }

            <ql-login-form [submitting]="vm.submitting" (submitted)="login($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [RouterLink, LetDirective, BackendErrorsComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  protected readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    errors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  protected login(credentials: LoginCredentials): void {
    this.store.dispatch(authActions.login({ credentials }));
  }
}
