import { UserModel, BackendErrorsModel } from '@shared/data-access/models';

export interface AuthStateModel {
  user: UserModel | null;
  submitting: boolean;
  errors: BackendErrorsModel | null;
}
