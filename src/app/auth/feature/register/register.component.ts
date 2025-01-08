import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions, selectErrors, selectSubmitting } from '@auth/data-access/state';
import { combineLatest } from 'rxjs';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { LetDirective } from '@ngrx/component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterCredentials } from '@auth/data-access/models';
import { RegisterFormComponent } from '@auth/ui/register-form';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <div class="mb-3 text-center">
            <h1>Sign up</h1>
            <a class="link-opacity-100" routerLink="/login">Have an account?</a>
          </div>

          <ng-container *ngrxLet="vm$; let vm">
            @let errors = vm.errors;

            @if (errors) {
              <ql-backend-errors [errors]="errors" />
            }

            <ql-register-form [submitting]="vm.submitting" (submitted)="register($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LetDirective,
    BackendErrorsComponent,
    RegisterFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    errors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  public register(credentials: RegisterCredentials): void {
    this.store.dispatch(authActions.register({ credentials }));
  }
}
