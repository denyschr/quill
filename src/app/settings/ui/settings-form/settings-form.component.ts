import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { User } from '@shared/data-access/api/models';

@Component({
  selector: 'ql-settings-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label for="image" class="form-label">URL of profile picture</label>
        <input id="image" type="text" class="form-control" formControlName="image" />
      </div>

      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input id="username" type="text" class="form-control" formControlName="username" />
        <val-errors controlName="username" label="The username" />
      </div>

      <div class="mb-3">
        <label for="bio" class="form-label">Bio</label>
        <textarea id="bio" class="form-control" rows="8" formControlName="bio"></textarea>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" type="email" class="form-control" formControlName="email" />
        <val-errors controlName="email" label="The email" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <input
            id="password"
            type="password"
            class="form-control"
            formControlName="password"
            #passwordInput
          />
          <ql-password-input-toggle [input]="passwordInput" />
        </div>
        <val-errors controlName="password" label="The password" />
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="submitting || form.invalid">
        Update Settings
      </button>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsComponent, PasswordInputToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsFormComponent {
  public readonly imageControl = this._fb.control('');
  public readonly usernameControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  public readonly bioControl = this._fb.control('');
  public readonly emailControl = this._fb.control('', [Validators.required, Validators.email]);
  public readonly passwordControl = this._fb.control('', [
    Validators.required,
    Validators.minLength(8)
  ]);

  public readonly form = this._fb.group({
    image: this.imageControl,
    username: this.usernameControl,
    bio: this.bioControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<Partial<User>>();

  @Input()
  public set user(currentUser: User) {
    this.form.patchValue({
      image: currentUser.image,
      username: currentUser.username,
      bio: currentUser.bio,
      email: currentUser.email
    });
  }

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    this.submitted.emit(this.form.getRawValue());
  }
}
