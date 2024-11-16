import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserFormData } from '@shared/data-access/models';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { ValidationErrorsComponent } from 'ngx-valdemort';

@Component({
  selector: 'ql-user-form',
  standalone: true,
  template: `
    <form [formGroup]="userForm" (ngSubmit)="submit()">
      <fieldset class="mb-3" [disabled]="submitting">
        <fieldset class="mb-3">
          <label for="image" class="form-label fw-bold">URL of profile picture</label>
          <input id="image" type="text" class="form-control" formControlName="image" />
        </fieldset>

        <fieldset class="mb-3">
          <label for="username" class="form-label fw-bold">Username</label>
          <input id="username" type="text" class="form-control" formControlName="username" />
          <val-errors controlName="username" label="The username"></val-errors>
        </fieldset>

        <fieldset class="mb-3">
          <label for="bio" class="form-label fw-bold">Bio</label>
          <textarea id="bio" rows="6" class="form-control" formControlName="bio"></textarea>
        </fieldset>

        <fieldset class="mb-3">
          <label for="email" class="form-label fw-bold">Email</label>
          <input id="email" type="email" class="form-control" formControlName="email" />
          <val-errors controlName="email" label="The email"></val-errors>
        </fieldset>

        <fieldset>
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
          Updating...
        } @else {
          Update Settings
        }
      </button>
    </form>
  `,
  imports: [ReactiveFormsModule, ValidationErrorsComponent, PasswordInputToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  public readonly imageControl = this._fb.control('');
  public readonly usernameControl = this._fb.control('', [Validators.required]);
  public readonly bioControl = this._fb.control('');
  public readonly emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this._fb.control('', [Validators.minLength(8)]);

  public readonly userForm = this._fb.group({
    image: this.imageControl,
    username: this.usernameControl,
    bio: this.bioControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<UserFormData>();

  @Input()
  public set user(user: User) {
    this.userForm.patchValue({
      image: user.image || '',
      username: user.username,
      bio: user.bio || '',
      email: user.email
    });
  }

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.userForm.getRawValue());
  }
}
