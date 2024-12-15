import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { BackendErrors, User } from '@shared/data-access/models';

export interface AuthState {
  currentUser: User | null | undefined;
  submitting: boolean;
  loading: boolean;
  errors: BackendErrors | null;
}

export const initialState: AuthState = {
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
        currentUser: currentUser,
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
        currentUser: currentUser
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
        currentUser: currentUser,
        submitting: false
      })
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { errors }): AuthState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(
      authActions.logout,
      (state): AuthState => ({
        ...state,
        ...initialState,
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
  selectErrors
} = authFeature;
