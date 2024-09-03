import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterFormComponent } from '@auth/ui/register-form';
import { Store } from '@ngrx/store';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/store';
import { RegisterCredentialsModel } from '@auth/data-access/models';
import { combineLatest } from 'rxjs';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'ql-register',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 pt-5 text-center">
            <h1 class="text-dark-emphasis">Sign up</h1>
            <a class="hover-underline text-success" routerLink="/login">Have an account?</a>
          </div>
          <ng-container *ngrxLet="vm$; let vm">
            @let backendErrors = vm.backendErrors;
            @if (backendErrors) {
              <ql-backend-errors [errors]="backendErrors" />
            }
            <ql-register-form [submitting]="vm.submitting" (submitted)="register($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink, LetDirective, BackendErrorsComponent, RegisterFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterComponent {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  public constructor(private readonly store: Store) {}

  public register(credentials: RegisterCredentialsModel): void {
    this.store.dispatch(authActions.register({ credentials }));
  }
}
