import { BackendErrorsModel } from '@shared/data-access/models';

export interface NewArticleStateModel {
  submitting: boolean;
  errors: BackendErrorsModel | null;
}
