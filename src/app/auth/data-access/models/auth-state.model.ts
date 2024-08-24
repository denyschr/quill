import { UserModel, BackendErrorsModel } from '@shared/data-access/models';

export interface AuthStateModel {
  currentUser: UserModel | null;
  authenticated: boolean;
  submitting: boolean;
  errors: BackendErrorsModel | null;
}
