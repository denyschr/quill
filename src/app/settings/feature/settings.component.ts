import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { authActions, selectCurrentUser } from '@app/auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';
import { selectErrors, selectSubmitting } from '@app/settings/data-access/state';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { UnsavedChanges } from '@app/core/utils';
import { SettingsFormComponent } from '@app/settings/ui/settings-form';
import { UserUpdate } from '@app/auth/data-access/models';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <h1 class="mb-3 text-center">Settings</h1>
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <ql-settings-form
              [user]="vm.currentUser"
              [submitting]="vm.submitting"
              (submitted)="update($event)"
            />

            <hr />

            <button class="btn btn-outline-danger" type="button" (click)="logout()">Log out</button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, BackendErrorsComponent, SettingsFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements UnsavedChanges {
  public readonly vm$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser).pipe(filter(Boolean)),
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  @ViewChild(SettingsFormComponent)
  public readonly settingsForm!: SettingsFormComponent;

  constructor(private readonly store: Store) {}

  public hasUnsavedChanges(): boolean {
    return !this.settingsForm.submitting && this.settingsForm.form.dirty;
  }

  public update(user: UserUpdate): void {
    this.store.dispatch(authActions.updateCurrentUser({ user }));
  }

  public logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
