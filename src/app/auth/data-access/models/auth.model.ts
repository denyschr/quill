import { UserModel, BackendErrorsModel } from '@shared/data-access/models';

export interface AuthStateModel {
  currentUser: UserModel | null;
  errors: BackendErrorsModel | null;
  status: AuthStatusModel;
}

export type AuthStatusModel =
  | 'pending'
  | 'authenticating'
  | 'creating'
  | 'authenticated'
  | 'unauthenticated';
