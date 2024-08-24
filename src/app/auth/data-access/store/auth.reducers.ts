import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthStateModel } from '@auth/data-access/models';

const initialState: AuthStateModel = {
  currentUser: null,
  submitting: false,
  errors: null
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.register,
      (state): AuthStateModel => ({
        ...state,
        submitting: true
      })
    ),
    on(
      authActions.registerSuccess,
      (state, { currentUser }): AuthStateModel => ({
        ...state,
        currentUser: currentUser,
        submitting: false,
        errors: null
      })
    ),
    on(
      authActions.registerFailure,
      (state, { errors }): AuthStateModel => ({
        ...state,
        submitting: false,
        errors: errors
      })
    )
  )
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectCurrentUser,
  selectErrors,
  selectSubmitting
} = authFeature;
