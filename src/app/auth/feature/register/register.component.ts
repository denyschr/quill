import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { ReactiveFormsModule } from '@angular/forms';

import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';

import { authActions, selectErrors, selectSubmitting } from '../../data-access/state';
import { RegisterCredentials } from '../../data-access/models';
import { RegisterFormComponent } from '../../ui/register-form';

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
            @if (vm.errors) {
              <ql-backend-errors [errors]="vm.errors" />
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
  protected readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    errors: this.store.select(selectErrors)
  });

  constructor(private readonly store: Store) {}

  protected register(credentials: RegisterCredentials): void {
    this.store.dispatch(authActions.register({ credentials }));
  }
}
