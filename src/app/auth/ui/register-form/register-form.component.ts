import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';

import { PasswordInputToggleComponent } from '@/app/core/ui/password-input-toggle';
import { FormControlValidationDirective } from '@/app/core/validation';

import { RegisterCredentials } from '../../data-access/models';

@Component({
  selector: 'ql-register-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          data-test="username-input"
          id="username"
          class="form-control"
          type="text"
          formControlName="username"
        />
        <val-errors controlName="username" label="The username" />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          data-test="email-input"
          id="email"
          class="form-control"
          type="email"
          formControlName="email"
        />
        <val-errors controlName="email" label="The email" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <input
            data-test="password-input"
            id="password"
            class="form-control"
            type="password"
            formControlName="password"
            #passwordInput
          />
          <ql-password-input-toggle [input]="passwordInput" />
        </div>
        <val-errors controlName="password" label="The password" />
      </div>

      <button
        data-test="submit-button"
        class="btn btn-primary"
        type="submit"
        [disabled]="submitting || form.invalid"
      >
        Sign up
      </button>
    </form>
  `,
  standalone: true,
  imports: [
    FormsModule,
    PasswordInputToggleComponent,
    ReactiveFormsModule,
    FormControlValidationDirective,
    ValidationErrorsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  protected readonly usernameControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  protected readonly emailControl = this.fb.control('', [Validators.required, Validators.email]);
  protected readonly passwordControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  protected readonly form = this.fb.group({
    username: this.usernameControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<RegisterCredentials>();

  constructor(private readonly fb: NonNullableFormBuilder) {}

  protected submit(): void {
    this.submitted.emit(this.form.getRawValue());
  }
}
