import { UserModel, BackendErrorsModel } from '@shared/data-access/models';

export interface AuthStateModel {
  currentUser: UserModel | null | undefined;
  submitting: boolean;
  loading: boolean;
  errors: BackendErrorsModel | null;
}
