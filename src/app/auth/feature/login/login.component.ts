import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { authActions, selectErrors, selectSubmitting } from '@app/auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import { LoginCredentials } from '@app/auth/data-access/models';
import { LoginFormComponent } from '@app/auth/ui/login-form';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 text-center">
            <h1>Sign in</h1>
            <a class="link-opacity-100" routerLink="/register">Don't have an account?</a>
          </div>
          <ng-container *ngrxLet="vm$; let vm">
            @let errors = vm.errors;

            @if (errors) {
              <ql-backend-errors [errors]="errors" />
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
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    errors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  public login(credentials: LoginCredentials): void {
    this.store.dispatch(authActions.login({ credentials }));
  }
}
