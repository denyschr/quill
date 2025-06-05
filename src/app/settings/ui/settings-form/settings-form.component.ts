import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';

import { PasswordInputToggleComponent } from '@/app/core/ui/password-input-toggle';
import { User, UserUpdate } from '@/app/auth/data-access/models';

@Component({
  selector: 'ql-settings-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label for="image" class="form-label">URL of profile picture</label>
        <input id="image" class="form-control" type="text" formControlName="image" />
      </div>

      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input id="username" class="form-control" type="text" formControlName="username" />
        <val-errors controlName="username" label="The username" />
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label">Bio</label>
        <textarea id="bio" class="form-control" rows="8" formControlName="bio"></textarea>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" class="form-control" type="email" formControlName="email" />
        <val-errors controlName="email" label="The email" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">
          Password
          <i class="text-muted">(leave blank if you don't want to change it)</i>
        </label>
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

      <button
        class="btn btn-primary"
        type="submit"
        [disabled]="!form.dirty || form.invalid || submitting"
      >
        Save
      </button>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsComponent, PasswordInputToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsFormComponent {
  protected readonly imageControl = this.fb.control('');
  protected readonly usernameControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  protected readonly bioControl = this.fb.control('');
  protected readonly emailControl = this.fb.control('', [Validators.required, Validators.email]);
  protected readonly passwordControl = this.fb.control('', [Validators.minLength(8)]);

  protected readonly form = this.fb.group({
    image: this.imageControl,
    username: this.usernameControl,
    bio: this.bioControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<UserUpdate>();

  @Input()
  public set user(currentUser: User) {
    this.form.patchValue({
      image: currentUser.image,
      username: currentUser.username,
      bio: currentUser.bio,
      email: currentUser.email
    });
  }

  constructor(private readonly fb: NonNullableFormBuilder) {}

  protected submit(): void {
    const { password, ...settings } = this.form.getRawValue();
    this.submitted.emit(password ? { ...settings, password } : settings);
  }
}
