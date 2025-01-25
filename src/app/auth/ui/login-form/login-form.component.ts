import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PasswordInputToggleComponent } from '@app/core/ui/password-input-toggle';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { LoginCredentials } from '@app/auth/data-access/models';
import { FormControlValidationDirective } from '@app/core/validation';

@Component({
  selector: 'ql-login-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
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

      <button class="btn btn-primary" type="submit" [disabled]="submitting || form.invalid">
        Sign in
      </button>
    </form>
  `,
  imports: [
    FormsModule,
    PasswordInputToggleComponent,
    ReactiveFormsModule,
    FormControlValidationDirective,
    ValidationErrorsComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  public readonly emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  public readonly form = this._fb.group({
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<LoginCredentials>();

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    this.submitted.emit(this.form.getRawValue());
  }
}
