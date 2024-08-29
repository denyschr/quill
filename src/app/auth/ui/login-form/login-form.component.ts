import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { LoginCredentialsModel } from '@auth/data-access/models';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';

@Component({
  selector: 'ql-login-form',
  standalone: true,
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="submit()">
      <fieldset [disabled]="submitting">
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
        @if (submitting) {
          <i class="bi bi-hourglass-split"></i>
          Authenticating...
        } @else {
          Sign in
        }
      </button>
    </form>
  `,
  imports: [NgClass, ReactiveFormsModule, ValidationErrorsComponent, PasswordInputToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  public emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public passwordControl = this._fb.control('', [Validators.required, Validators.minLength(8)]);

  public loginForm = this._fb.group({
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting: boolean = false;

  @Output()
  public readonly submitted = new EventEmitter<LoginCredentialsModel>();

  public constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const credentials = this.loginForm.getRawValue();
    this.submitted.emit(credentials);
  }
}
