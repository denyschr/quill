import { createActionGroup, props } from '@ngrx/store';
import { ProfileModel } from '@shared/data-access/models';

export const profileActions = createActionGroup({
  source: 'Profile API',
  events: {
    'Get Profile': props<{ username: string }>(),
    'Get Profile Success': props<{ profile: ProfileModel }>(),
    'Get Profile Failure': props<{ error: string }>()
  }
});
