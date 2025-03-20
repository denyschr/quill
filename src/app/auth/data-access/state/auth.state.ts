import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { BackendErrors } from '@app/core/data-access/models';
import { User } from '@app/auth/data-access/models';

export interface AuthState {
  currentUser: User | null | undefined;
  submitting: boolean;
  loading: boolean;
  errors: BackendErrors | null;
}

export const authInitialState: AuthState = {
  currentUser: undefined,
  submitting: false,
  loading: false,
  errors: null
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    authInitialState,
    on(
      authActions.getCurrentUser,
      (state): AuthState => ({
        ...state,
        loading: true
      })
    ),
    on(
      authActions.getCurrentUserSuccess,
      (state, { currentUser }): AuthState => ({
        ...state,
        currentUser,
        loading: false
      })
    ),
    on(
      authActions.getCurrentUserFailure,
      (state): AuthState => ({
        ...state,
        currentUser: null,
        loading: false
      })
    ),
    on(
      authActions.updateCurrentUserSuccess,
      (state, { currentUser }): AuthState => ({
        ...state,
        currentUser
      })
    ),
    on(
      authActions.login,
      authActions.register,
      (state): AuthState => ({
        ...state,
        submitting: true,
        errors: null
      })
    ),
    on(
      authActions.loginSuccess,
      authActions.registerSuccess,
      (state, { currentUser }): AuthState => ({
        ...state,
        currentUser,
        submitting: false
      })
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { errors }): AuthState => ({
        ...state,
        submitting: false,
        errors
      })
    ),
    on(
      authActions.logout,
      (state): AuthState => ({
        ...state,
        ...authInitialState,
        currentUser: null
      })
    ),
    on(
      routerNavigatedAction,
      (state): AuthState => ({
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
  selectSubmitting,
  selectLoading,
  selectErrors
} = authFeature;
