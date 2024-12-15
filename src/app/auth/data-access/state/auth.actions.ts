import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials } from '@auth/data-access/models';
import { BackendErrors, User } from '@shared/data-access/models';

export const authActions = createActionGroup({
  source: 'Auth API',
  events: {
    Register: props<{ credentials: RegisterCredentials }>(),
    'Register Success': props<{ currentUser: User }>(),
    'Register Failure': props<{ errors: BackendErrors }>(),

    Login: props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ currentUser: User }>(),
    'Login Failure': props<{ errors: BackendErrors }>(),

    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ currentUser: User }>(),
    'Get Current User Failure': emptyProps(),

    'Update Current User': props<{ user: Partial<User> }>(),
    'Update Current User Success': props<{ currentUser: User }>(),
    'Update Current User Failure': props<{ errors: BackendErrors }>(),

    Logout: emptyProps()
  }
});
