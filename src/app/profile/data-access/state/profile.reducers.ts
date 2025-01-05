import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './profile.actions';
import { Profile } from '@shared/data-access/models';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null
};

const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialState,
    on(
      profileActions.getProfile,
      (state): ProfileState => ({
        ...state,
        loading: true
      })
    ),
    on(
      profileActions.getProfileSuccess,
      (state, { profile }): ProfileState => ({
        ...state,
        profile: profile,
        loading: false
      })
    ),
    on(
      profileActions.getProfileFailure,
      (state, { error }): ProfileState => ({
        ...state,
        loading: false,
        error: error
      })
    )
  )
});

export const {
  name: profileFeatureKey,
  reducer: profileReducer,
  selectProfile,
  selectLoading,
  selectError
} = profileFeature;
