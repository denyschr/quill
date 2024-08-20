import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterFormComponent } from '../../ui/register-form/register-form.component';
import { authActions } from '../../data-access/store/auth.actions';
import { Store } from '@ngrx/store';
import { RegisterCredentialsModel } from '../../data-access/models/register-credentials.model';
import { combineLatest } from 'rxjs';
import { selectErrors, selectSubmitting } from '../../data-access/store/auth.reducers';
import { AsyncPipe } from '@angular/common';
import { BackendErrorsComponent } from '../../../shared/ui/backend-errors/backend-errors.component';

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
          @if (vm$ | async; as vm) {
            <ql-backend-errors [errors]="vm.backendErrors" />
            <ql-register-form
              [submitting]="vm.submitting"
              (submitted)="register($event)"
              #registerForm
            />
          }
        </div>
      </div>
    </div>
  `,
  styles: [``],
  imports: [RouterLink, AsyncPipe, BackendErrorsComponent, RegisterFormComponent],
  providers: [],
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
