import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '@shared/data-access/models';

export const profileActions = createActionGroup({
  source: 'Profile API',
  events: {
    loadProfile: props<{ username: string }>(),
    loadProfileSuccess: props<{ profile: Profile }>(),
    loadProfileFailure: emptyProps()
  }
});
