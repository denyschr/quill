import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { BackendErrors } from '@/app/core/data-access/models';

import { LoginCredentials, RegisterCredentials, User, UserUpdate } from '../models';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    getCurrentUser: emptyProps(),
    getCurrentUserSuccess: props<{ currentUser: User }>(),
    getCurrentUserFailure: emptyProps(),

    updateCurrentUser: props<{ user: UserUpdate }>(),
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
