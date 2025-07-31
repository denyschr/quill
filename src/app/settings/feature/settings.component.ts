import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';

import { authActions, selectCurrentUser } from '@/app/auth/data-access/state';
import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';
import { UserUpdate } from '@/app/auth/data-access/models';

import { selectErrors, selectSubmitting } from '../data-access/state';
import { SettingsFormComponent } from '../ui/settings-form';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <h1 data-test="settings-title" class="mb-3 text-center">Settings</h1>
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

            <button
              data-test="logout-button"
              class="btn btn-outline-danger"
              type="button"
              (click)="logout()"
            >
              Log out
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, BackendErrorsComponent, SettingsFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  protected readonly vm$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser).pipe(filter(Boolean)),
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  protected update(user: UserUpdate): void {
    this.store.dispatch(authActions.updateCurrentUser({ user }));
  }

  protected logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
