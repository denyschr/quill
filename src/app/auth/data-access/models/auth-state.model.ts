import { UserModel } from '../../../shared/models/user.model';
import { BackendErrorsModel } from '../../../shared/models/backend-errors.model';

export interface AuthStateModel {
  user: UserModel | null;
  submitting: boolean;
  errors: BackendErrorsModel | null;
}
