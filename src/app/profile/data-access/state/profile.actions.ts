import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '@app/profile/data-access/models';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    loadProfile: props<{ username: string }>(),
    loadProfileSuccess: props<{ profile: Profile }>(),
    loadProfileFailure: emptyProps(),

    follow: props<{ username: string }>(),
    followSuccess: props<{ profile: Profile }>(),
    followFailure: emptyProps(),

    unfollow: props<{ username: string }>(),
    unfollowSuccess: props<{ profile: Profile }>(),
    unfollowFailure: emptyProps()
  }
});
