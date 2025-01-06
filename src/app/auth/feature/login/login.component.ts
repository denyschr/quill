import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { ValidationErrorsComponent } from 'ngx-valdemort';

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
            @let submitting = vm.submitting;
            @let errors = vm.errors;

            @if (errors) {
              <ql-backend-errors [errors]="errors" />
            }

            <form [formGroup]="loginForm" (ngSubmit)="login()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input id="email" type="email" class="form-control" formControlName="email" />
                <val-errors controlName="email" label="The email" />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    formControlName="password"
                    #passwordInput
                  />
                  <ql-password-input-toggle [input]="passwordInput" />
                </div>
                <val-errors controlName="password" label="The password" />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="submitting || loginForm.invalid"
              >
                Sign in
              </button>
            </form>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LetDirective,
    ValidationErrorsComponent,
    BackendErrorsComponent,
    PasswordInputToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public readonly emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  public readonly loginForm = this._fb.group({
    email: this.emailControl,
    password: this.passwordControl
  });

  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    errors: this.store.select(selectErrors)
  });

  constructor(
    private readonly _fb: NonNullableFormBuilder,
    private readonly store: Store
  ) {}

  public login(): void {
    const credentials = this.loginForm.getRawValue();
    this.store.dispatch(authActions.login({ credentials }));
  }
}
