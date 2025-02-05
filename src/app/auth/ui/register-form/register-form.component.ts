import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RegisterCredentials } from '@app/auth/data-access/models';
import { PasswordInputToggleComponent } from '@app/core/ui/password-input-toggle';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '@app/core/validation';

@Component({
  selector: 'ql-register-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input id="username" class="form-control" type="text" formControlName="username" />
        <val-errors controlName="username" label="The username" />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" class="form-control" type="email" formControlName="email" />
        <val-errors controlName="email" label="The email" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <input
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

      <button type="submit" class="btn btn-primary" [disabled]="submitting || form.invalid">
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
  public readonly usernameControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  public readonly emailControl = this.fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  public readonly form = this.fb.group({
    username: this.usernameControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<RegisterCredentials>();

  constructor(private readonly fb: NonNullableFormBuilder) {}

  public submit(): void {
    this.submitted.emit(this.form.getRawValue());
  }
}
