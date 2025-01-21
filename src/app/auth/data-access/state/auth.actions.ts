import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials } from '@app/auth/data-access/models';
import { BackendErrors, User } from '@app/shared/data-access/api/models';

export const authActions = createActionGroup({
  source: 'Auth API',
  events: {
    getCurrentUser: emptyProps(),
    getCurrentUserSuccess: props<{ currentUser: User }>(),
    getCurrentUserFailure: emptyProps(),

    updateCurrentUser: props<{ user: Partial<User> }>(),
    updateCurrentUserSuccess: props<{ currentUser: User }>(),
    updateCurrentUserFailure: props<{ errors: BackendErrors }>(),

    register: props<{ credentials: RegisterCredentials }>(),
    registerSuccess: props<{ currentUser: User }>(),
    registerFailure: props<{ errors: BackendErrors }>(),

    login: props<{ credentials: LoginCredentials }>(),
    loginSuccess: props<{ currentUser: User }>(),
    loginFailure: props<{ errors: BackendErrors }>(),

    logout: emptyProps()
  }
});
