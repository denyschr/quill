import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './profile.actions';
import { Profile } from '@shared/data-access/api/models';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
}

export const profileInitialState: ProfileState = {
  profile: null,
  loading: false
};

const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    profileInitialState,
    on(
      profileActions.loadProfile,
      (state): ProfileState => ({
        ...state,
        loading: true
      })
    ),
    on(
      profileActions.loadProfileSuccess,
      (state, { profile }): ProfileState => ({
        ...state,
        profile: profile,
        loading: false
      })
    ),
    on(
      profileActions.loadProfileFailure,
      (state): ProfileState => ({
        ...state,
        loading: false
      })
    ),
    on(
      profileActions.followSuccess,
      profileActions.unfollowSuccess,
      (state, { profile }): ProfileState => ({
        ...state,
        profile
      })
    )
  )
});

export const {
  name: profileFeatureKey,
  reducer: profileReducer,
  selectProfile,
  selectLoading
} = profileFeature;
