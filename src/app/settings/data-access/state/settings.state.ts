import { authActions } from '@app/auth/data-access/state';
import { routerNavigationAction } from '@ngrx/router-store';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BackendErrors } from '@app/shared/data-access/api/models';

export interface SettingsState {
  submitting: boolean;
  errors: BackendErrors | null;
}

export const settingsInitialState: SettingsState = {
  submitting: false,
  errors: null
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    settingsInitialState,
    on(
      authActions.updateCurrentUser,
      (state): SettingsState => ({
        ...state,
        submitting: true,
        errors: null
      })
    ),
    on(
      authActions.updateCurrentUserSuccess,
      (state): SettingsState => ({
        ...state,
        submitting: false
      })
    ),
    on(
      authActions.updateCurrentUserFailure,
      (state, { errors }): SettingsState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): SettingsState => settingsInitialState)
  )
});

export const {
  name: settingsFeatureKey,
  reducer: settingsReducer,
  selectSubmitting,
  selectErrors
} = settingsFeature;
