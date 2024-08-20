import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldComponent } from '@shared/ui/form-field';
import { InputDirective } from '@shared/directives/input';
import { PasswordInputToggleDirective } from '@shared/directives/password-input-toggle';
import { IconButtonComponent } from '@shared/ui/icon-button';
import { RegisterCredentialsModel } from '@auth/data-access/models';

@Component({
  selector: 'ql-register-form',
  standalone: true,
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="submit()">
      <fieldset [disabled]="submitting">
        <fieldset class="mb-3">
          <ql-form-field controlKey="username">
            <label for="username" class="form-label fw-bold">Username</label>
            <input
              id="username"
              qlInput
              type="text"
              class="form-control"
              formControlName="username"
            />
          </ql-form-field>
        </fieldset>
        <fieldset class="mb-3">
          <ql-form-field controlKey="email">
            <label for="email" class="form-label fw-bold">Email</label>
            <input id="email" qlInput type="email" class="form-control" formControlName="email" />
          </ql-form-field>
        </fieldset>
        <fieldset class="mb-3">
          <ql-form-field controlKey="password">
            <label for="password" class="form-label fw-bold">Password</label>
            <input
              id="password"
              qlInput
              type="password"
              class="form-control"
              formControlName="password"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              qlPasswordInputToggle
              qlIconButton
              placement="bottom"
              ngbTooltip="Toggle visibility"
              container="body"
            ></button>
          </ql-form-field>
        </fieldset>
      </fieldset>
      <button type="submit" class="btn btn-success w-100" [disabled]="submitting">
        @if (submitting) {
          <i class="bi bi-hourglass-split"></i>
          Creating...
        } @else {
          Sign up
        }
      </button>
    </form>
  `,
  styles: [``],
  imports: [
    NgClass,
    NgbTooltip,
    ReactiveFormsModule,
    InputDirective,
    PasswordInputToggleDirective,
    IconButtonComponent,
    FormFieldComponent
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  public usernameControl = this._fb.control('', [Validators.required, Validators.minLength(3)]);
  public emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public passwordControl = this._fb.control('', [Validators.required, Validators.minLength(8)]);

  public registerForm = this._fb.group({
    username: this.usernameControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting: boolean = false;

  @Output()
  public readonly submitted = new EventEmitter<RegisterCredentialsModel>();

  public constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const credentials = this.registerForm.getRawValue();
    this.submitted.emit(credentials);
  }
}
