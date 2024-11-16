import { authActions } from '@auth/data-access/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BackendErrors } from '@shared/data-access/models';

export interface SettingsState {
  submitting: boolean;
  errors: BackendErrors | null;
}

const initialState: SettingsState = {
  submitting: false,
  errors: null
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
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
    on(routerNavigationAction, (): SettingsState => initialState)
  )
});

export const {
  name: settingsFeatureKey,
  reducer: settingsReducer,
  selectSubmitting,
  selectErrors
} = settingsFeature;
