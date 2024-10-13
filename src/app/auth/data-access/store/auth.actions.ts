import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginCredentialsModel, RegisterCredentialsModel } from '@auth/data-access/models';
import { BackendErrorsModel, UserModel } from '@shared/data-access/models';

export const authActions = createActionGroup({
  source: 'Auth API',
  events: {
    Register: props<{ credentials: RegisterCredentialsModel }>(),
    'Register Success': props<{ currentUser: UserModel }>(),
    'Register Failure': props<{ errors: BackendErrorsModel }>(),

    Login: props<{ credentials: LoginCredentialsModel }>(),
    'Login Success': props<{ currentUser: UserModel }>(),
    'Login Failure': props<{ errors: BackendErrorsModel }>(),

    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ currentUser: UserModel }>(),
    'Get Current User Failure': emptyProps(),

    'Update Current User': props<{ user: Partial<UserModel> }>(),
    'Update Current User Success': props<{ currentUser: UserModel }>(),
    'Update Current User Failure': props<{ errors: BackendErrorsModel }>(),

    Logout: emptyProps()
  }
});
