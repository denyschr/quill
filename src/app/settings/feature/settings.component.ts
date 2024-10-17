import { ChangeDetectionStrategy, Component } from '@angular/core';
import { authActions, selectCurrentUser } from '@auth/data-access/store';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { UserFormComponent } from '@settings/ui/user-form';
import { UserFormDataModel } from '@shared/data-access/models';
import { combineLatest, filter } from 'rxjs';
import { selectErrors, selectSubmitting } from '@settings/data-access/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';

@Component({
  selector: 'ql-settings',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 text-center">
            <h1 class="text-dark-emphasis">Your Settings</h1>
          </div>
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <ql-user-form
              [user]="vm.currentUser"
              [submitting]="vm.submitting"
              (submitted)="submitUser($event)"
            />

            <hr />

            <button
              type="button"
              class="btn btn-outline-danger"
              [disabled]="vm.submitting"
              (click)="logout()"
            >
              Log out
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [LetDirective, UserFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SettingsComponent {
  public readonly currentUser$ = this.store.select(selectCurrentUser).pipe(filter(Boolean));

  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors),
    currentUser: this.currentUser$
  });

  public constructor(private readonly store: Store) {}

  public submitUser(user: UserFormDataModel): void {
    this.store.dispatch(authActions.updateCurrentUser({ user }));
  }

  public logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
