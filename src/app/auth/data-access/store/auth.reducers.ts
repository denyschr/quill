import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthStateModel } from '@auth/data-access/models';
import { routerNavigatedAction } from '@ngrx/router-store';

const initialState: AuthStateModel = {
  currentUser: null,
  errors: null,
  status: 'pending'
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.login,
      (state): AuthStateModel => ({
        ...state,
        errors: null,
        status: 'authenticating'
      })
    ),
    on(
      authActions.register,
      (state): AuthStateModel => ({
        ...state,
        errors: null,
        status: 'creating'
      })
    ),
    on(
      authActions.loginSuccess,
      authActions.registerSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        status: 'authenticated'
      })
    ),
    on(
      authActions.loginFailure,
      authActions.registerFailure,
      (state, { errors }): AuthStateModel => ({
        ...state,
        errors: errors,
        status: 'unauthenticated'
      })
    ),
    on(
      authActions.getCurrentUser,
      (state): AuthStateModel => ({
        ...state
      })
    ),
    on(
      authActions.getCurrentUserSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        status: 'authenticated'
      })
    ),
    on(
      authActions.getCurrentUserFailure,
      (state): AuthStateModel => ({
        ...state,
        status: 'unauthenticated'
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
        status: 'unauthenticated'
      })
    )
  )
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectCurrentUser,
  selectErrors,
  selectStatus
} = authFeature;
