import { authActions } from '@auth/data-access/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SettingsStateModel } from '@settings/data-access/models';

const initialState: SettingsStateModel = {
  submitting: false,
  errors: null
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(
      authActions.updateCurrentUser,
      (state): SettingsStateModel => ({
        ...state,
        submitting: true,
        errors: null
      })
    ),
    on(
      authActions.updateCurrentUserSuccess,
      (state): SettingsStateModel => ({
        ...state,
        submitting: false
      })
    ),
    on(
      authActions.updateCurrentUserFailure,
      (state, { errors }): SettingsStateModel => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): SettingsStateModel => initialState)
  )
});

export const {
  name: settingsFeatureKey,
  reducer: settingsReducer,
  selectSubmitting,
  selectErrors
} = settingsFeature;
