import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthStateModel } from '@auth/data-access/models';
import { routerNavigatedAction } from '@ngrx/router-store';

const initialState: AuthStateModel = {
  currentUser: null,
  authenticated: false,
  submitting: false,
  errors: null
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.login,
      authActions.register,
      (state): AuthStateModel => ({
        ...state,
        submitting: true
      })
    ),
    on(
      authActions.loginSuccess,
      authActions.registerSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        authenticated: true,
        submitting: false,
        errors: null
      })
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { errors }): AuthStateModel => ({
        ...state,
        authenticated: false,
        submitting: false,
        errors: errors
      })
    ),
    on(
      routerNavigatedAction,
      (state): AuthStateModel => ({
        ...state,
        errors: null
      })
    )
  )
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectCurrentUser,
  selectErrors,
  selectSubmitting,
  selectAuthenticated
} = authFeature;
