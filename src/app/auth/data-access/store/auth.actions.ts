import { createActionGroup, props } from '@ngrx/store';
import { RegisterCredentialsModel } from '@auth/data-access/models';
import { BackendErrorsModel, UserModel } from '@shared/data-access/models';

export const authActions = createActionGroup({
  source: 'Auth API',
  events: {
    Register: props<{ credentials: RegisterCredentialsModel }>(),
    'Register Success': props<{ currentUser: UserModel }>(),
    'Register Failure': props<{ errors: BackendErrorsModel }>()
  }
});
