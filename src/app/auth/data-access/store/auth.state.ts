import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthStateModel } from '@auth/data-access/models';
import { routerNavigatedAction } from '@ngrx/router-store';

export const initialState: AuthStateModel = {
  currentUser: undefined,
  submitting: false,
  loading: false,
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
        submitting: true,
        errors: null
      })
    ),
    on(
      authActions.loginSuccess,
      authActions.registerSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        submitting: false
      })
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { errors }): AuthStateModel => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(
      authActions.getCurrentUser,
      (state): AuthStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      authActions.getCurrentUserSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        loading: false
      })
    ),
    on(
      authActions.getCurrentUserFailure,
      (state): AuthStateModel => ({
        ...state,
        currentUser: null,
        loading: false
      })
    ),
    on(
      authActions.updateCurrentUserSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser
      })
    ),
    on(
      routerNavigatedAction,
      (state): AuthStateModel => ({
        ...state,
        errors: null
      })
    ),
    on(
      authActions.logout,
      (state): AuthStateModel => ({
        ...state,
        ...initialState,
        currentUser: null
      })
    )
  )
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectCurrentUser,
  selectSubmitting,
  selectLoading,
  selectErrors
} = authFeature;
