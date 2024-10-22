import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginCredentialsModel } from '@auth/data-access/models';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/store';
import { LoginFormComponent } from '@auth/ui/login-form';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ql-login',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 pt-5 text-center">
            <h1 class="text-dark-emphasis">Sign in</h1>
            <a class="hover-underline text-success" routerLink="/register"
              >Don't have an account?</a
            >
          </div>
          <ng-container *ngrxLet="vm$; let vm">
            @let backendErros = vm.backendErrors;
            @if (backendErros) {
              <ql-backend-errors [errors]="backendErros" />
            }
            <ql-login-form [submitting]="vm.submitting" (submitted)="login($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink, LetDirective, BackendErrorsComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  public login(credentials: LoginCredentialsModel): void {
    this.store.dispatch(authActions.login({ credentials }));
  }
}
