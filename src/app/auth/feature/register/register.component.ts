import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/store';
import { combineLatest } from 'rxjs';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { LetDirective } from '@ngrx/component';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { NgClass } from '@angular/common';
import { FormControlValidationDirective } from '@shared/directives/form-control-validation';

@Component({
  selector: 'ql-register',
  standalone: true,
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 pt-5 text-center">
            <h1>Sign up</h1>
            <a class="link-opacity-100" routerLink="/login">Have an account?</a>
          </div>

          <ng-container *ngrxLet="vm$; let vm">
            @let submitting = vm.submitting;
            @let errors = vm.errors;

            @if (errors) {
              <ql-backend-errors [errors]="errors" />
            }

            <form [formGroup]="registerForm" (ngSubmit)="submit()">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input id="username" type="text" class="form-control" formControlName="username" />
                <val-errors controlName="username" label="The username"></val-errors>
              </div>

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
                [disabled]="submitting || registerForm.invalid"
              >
                Sign up
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
    LetDirective,
    FormControlValidationDirective,
    ValidationErrorsComponent,
    BackendErrorsComponent,
    PasswordInputToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterComponent {
  public readonly usernameControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  public readonly emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  public readonly registerForm = this._fb.group({
    username: this.usernameControl,
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
    const credentials = this.registerForm.getRawValue();
    this.store.dispatch(authActions.register({ credentials }));
  }
}
