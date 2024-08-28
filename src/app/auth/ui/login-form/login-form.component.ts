import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldComponent } from '@shared/ui/form-field';
import { InputDirective } from '@shared/directives/input';
import { PasswordInputToggleDirective } from '@shared/directives/password-input-toggle';
import { IconButtonComponent } from '@shared/ui/icon-button';
import { LoginCredentialsModel } from '@auth/data-access/models';

@Component({
  selector: 'ql-login-form',
  standalone: true,
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="submit()">
      <fieldset [disabled]="submitting">
        <fieldset class="mb-3">
          <ql-form-field>
            <label for="email" class="form-label fw-bold">Email</label>
            <input id="email" qlInput type="email" class="form-control" formControlName="email" />
          </ql-form-field>
        </fieldset>

        <fieldset class="mb-3">
          <ql-form-field>
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
          Authenticating...
        } @else {
          Sign in
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
