import { createActionGroup, props } from '@ngrx/store';
import { RegisterCredentialsModel } from '../models/register-credentials.model';
import { UserModel } from '../../../shared/models/user.model';
import { BackendErrorsModel } from '../../../shared/models/backend-errors.model';

export const authActions = createActionGroup({
  source: 'Auth API',
  events: {
    Register: props<{ credentials: RegisterCredentialsModel }>(),
    'Register Success': props<{ user: UserModel }>(),
    'Register Failure': props<{ errors: BackendErrorsModel }>()
  }
});
