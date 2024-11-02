import { LoginCredentialsModel, RegisterCredentialsModel } from '@auth/data-access/models';
import * as fromAuth from './auth.state';
import { authActions } from './auth.actions';

describe('AuthState', () => {
  const user = {
    email: 'email@gmail.com',
    token: 'token',
    username: 'username',
    bio: null,
    image: 'image'
  };
  const errors = {
    'email or password': ['is invalid']
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAuth;
      const action = {
        type: 'Unknown'
      };
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('register action', () => {
    it('should set submitting to true', () => {
      const { initialState } = fromAuth;
      const credentials: RegisterCredentialsModel = {
        username: user.username,
        email: user.email,
        password: '12345678'
      };
      const newState = {
        ...initialState,
        submitting: true
      };
      const action = authActions.register({ credentials });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should have no error and no submitting state if success', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user,
        submitting: false
      };
      const action = authActions.registerSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should have an error and no submitting state if failed', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        submitting: false,
        errors: errors
      };
      const action = authActions.registerFailure({ errors });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should set submitting to true', () => {
      const { initialState } = fromAuth;
      const credentials: LoginCredentialsModel = {
        email: user.email,
        password: '12345678'
      };
      const newState = {
        ...initialState,
        submitting: true
      };
      const action = authActions.login({ credentials });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should have no error and no submitting state if success', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user,
        submitting: false
      };
      const action = authActions.loginSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should have an error and no submitting state', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        submitting: false,
        errors: errors
      };
      const action = authActions.loginFailure({ errors });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('getCurrentUser action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        loading: true
      };
      const action = authActions.getCurrentUser();
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should add the user, have no error and loading state if success', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user,
        loading: false
      };
      const action = authActions.getCurrentUserSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should set currentUser to null and have no loading state if failed', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: null,
        loading: false
      };
      const action = authActions.getCurrentUserFailure();
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('updateCurrentUser action', () => {
    it('should update the user if success', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user
      };
      const action = authActions.updateCurrentUserSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('logout action', () => {
    it('should logout the user', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: null
      };
      const action = authActions.logout();
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
