import { BackendErrorsModel } from '@shared/data-access/models';

export interface SettingsStateModel {
  submitting: boolean;
  errors: BackendErrorsModel | null;
}
