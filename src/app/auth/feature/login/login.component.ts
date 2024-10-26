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

@Component({
  selector: 'ql-login',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 pt-5 text-center">
            <h1 class="text-dark-emphasis">Sign in</h1>
            <a class="hover-underline text-success" routerLink="/register"
              >Don't have an account?</a
            >
          </div>

          <ng-container *ngrxLet="vm$; let vm">
            @let submitting = vm.submitting;
            @let backendErrors = vm.backendErrors;

            @if (backendErrors) {
              <ql-backend-errors [errors]="backendErrors" />
            }

            <form [formGroup]="loginForm" (ngSubmit)="submit()">
              <fieldset id="form-fields" [disabled]="submitting">
                <fieldset class="mb-3">
                  <label for="email" class="form-label fw-bold">Email</label>
                  <input id="email" type="email" class="form-control" formControlName="email" />
                  <val-errors controlName="email" label="The email"></val-errors>
                </fieldset>

                <fieldset class="mb-3">
                  <label for="password" class="form-label fw-bold">Password</label>
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
                </fieldset>
              </fieldset>

              <button type="submit" class="btn btn-success w-100" [disabled]="submitting">
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
    LetDirective,
    ValidationErrorsComponent,
    BackendErrorsComponent,
    PasswordInputToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
  public emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public passwordControl = this._fb.control('', [Validators.required, Validators.minLength(8)]);

  public loginForm = this._fb.group({
    email: this.emailControl,
    password: this.passwordControl
  });

  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  constructor(
    private readonly _fb: NonNullableFormBuilder,
    private readonly store: Store
  ) {}

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();

    this.store.dispatch(authActions.login({ credentials }));
  }
}
