import { ChangeDetectionStrategy, Component } from '@angular/core';
import { authActions, selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest, filter, tap } from 'rxjs';
import { selectErrors, selectSubmitting } from '@settings/data-access/state';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { User } from '@shared/data-access/models';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { UnsavedChanges } from '@shared/data-access/guards';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <h1 class="mb-3 text-center">Your Settings</h1>
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <form [formGroup]="userForm" (ngSubmit)="update()">
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

              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="vm.submitting || userForm.invalid"
              >
                Update Settings
              </button>
            </form>

            <hr />

            <button type="button" class="btn btn-outline-danger" (click)="logout()">Log out</button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    LetDirective,
    BackendErrorsComponent,
    ReactiveFormsModule,
    ValidationErrorsComponent,
    PasswordInputToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements UnsavedChanges {
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

  public readonly userForm = this._fb.group({
    image: this.imageControl,
    username: this.usernameControl,
    bio: this.bioControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors),
    currentUser: this.store.select(selectCurrentUser).pipe(
      filter(Boolean),
      tap(currentUser => {
        this.initUserForm(currentUser);
      })
    )
  });

  constructor(
    private readonly _fb: NonNullableFormBuilder,
    private readonly store: Store
  ) {}

  public hasUnsavedChanges(): boolean {
    return this.userForm.dirty;
  }

  public initUserForm(currentUser: User): void {
    this.userForm.patchValue({
      image: currentUser.image,
      username: currentUser.username,
      bio: currentUser.bio,
      email: currentUser.email
    });
  }

  public update(): void {
    this.store.dispatch(authActions.updateCurrentUser({ user: this.userForm.getRawValue() }));
  }

  public logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
