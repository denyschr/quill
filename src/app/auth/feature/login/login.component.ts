import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/store';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { NgClass } from '@angular/common';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '@shared/directives/form-control-validation';

@Component({
  selector: 'ql-login',
  standalone: true,
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 pt-5 text-center">
            <h1>Sign in</h1>
            <a class="link-opacity-100" routerLink="/register">Don't have an account?</a>
          </div>

          <ng-container *ngrxLet="vm$; let vm">
            @let submitting = vm.submitting;
            @let errors = vm.errors;

            @if (errors) {
              <ql-backend-errors [errors]="errors" />
            }

            <form [formGroup]="loginForm" (ngSubmit)="submit()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input id="email" type="email" class="form-control" formControlName="email" />
                <val-errors controlName="email" label="The email"></val-errors>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    formControlName="password"
                    #inputElement
                  />
                  <ql-password-input-toggle [input]="inputElement" />
                </div>
                <val-errors controlName="password" label="The password"></val-errors>
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
  imports: [
    RouterLink,
    NgClass,
    ReactiveFormsModule,
    FormControlValidationDirective,
    LetDirective,
    ValidationErrorsComponent,
    BackendErrorsComponent,
    PasswordInputToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
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

  public submit(): void {
    const credentials = this.loginForm.getRawValue();
    this.store.dispatch(authActions.login({ credentials }));
  }
}
