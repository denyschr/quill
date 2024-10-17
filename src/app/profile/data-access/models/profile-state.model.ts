import { ProfileModel } from '@shared/data-access/models';

export interface ProfileStateModel {
  profile: ProfileModel | null;
  loading: boolean;
  error: string | null;
}
