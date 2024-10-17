import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileStateModel } from '@profile/data-access/models';
import { profileActions } from './profile.actions';
import { routerNavigationAction } from '@ngrx/router-store';

const initialState: ProfileStateModel = {
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
      (state): ProfileStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      profileActions.getProfileSuccess,
      (state, { profile }): ProfileStateModel => ({
        ...state,
        profile: profile,
        loading: false
      })
    ),
    on(
      profileActions.getProfileFailure,
      (state, { error }): ProfileStateModel => ({
        ...state,
        loading: false,
        error: error
      })
    ),
    on(routerNavigationAction, (): ProfileStateModel => initialState)
  )
});

export const {
  name: profileFeatureKey,
  reducer: profileReducer,
  selectProfile,
  selectLoading,
  selectError
} = profileFeature;
