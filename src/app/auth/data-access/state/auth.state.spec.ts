import * as fromAuth from './auth.state';
import { authActions } from './auth.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { User } from '@shared/data-access/api/models';

describe('AuthState', () => {
  const user = { username: 'username', email: 'email' } as User;
  const errors = {
    email: ['already exists'],
    'email or password': ['is invalid']
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const { authInitialState } = fromAuth;
      const action = {
        type: 'Unknown'
      };
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toBe(authInitialState);
    });
  });

  describe('getCurrentUser action', () => {
    it('should set loading to true', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        loading: true
      };
      const action = authActions.getCurrentUser();
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should retrieve the user and set loading to false on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: user,
        loading: false
      };
      const action = authActions.getCurrentUserSuccess({ currentUser: user });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should set currentUser to null and loading to false on failure', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: null,
        loading: false
      };
      const action = authActions.getCurrentUserFailure();
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('updateCurrentUser action', () => {
    it('should update the user on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: user
      };
      const action = authActions.updateCurrentUserSuccess({ currentUser: user });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('register action', () => {
    it('should set submitting to true and reset the error state to null', () => {
      const { authInitialState } = fromAuth;
      const credentials = {
        username: user.username,
        email: user.email,
        password: '12345678'
      };
      const newState = {
        ...authInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.register({ credentials });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should register the user and set submitting to false on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: user,
        submitting: false
      };
      const action = authActions.registerSuccess({ currentUser: user });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        submitting: false,
        errors
      };
      const action = authActions.registerFailure({ errors });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('login action', () => {
    it('should set submitting to true and reset the error state to null', () => {
      const { authInitialState } = fromAuth;
      const credentials = {
        email: user.email,
        password: '12345678'
      };
      const newState = {
        ...authInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.login({ credentials });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should login the user and set submitting to false on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: user,
        submitting: false
      };
      const action = authActions.loginSuccess({ currentUser: user });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        submitting: false,
        errors
      };
      const action = authActions.loginFailure({ errors });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('logout action', () => {
    it('should logout the user', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: null
      };
      const action = authActions.logout();
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('routerNavigated action', () => {
    it('should reset the error state to null on navigation', () => {
      const { authInitialState } = fromAuth;
      const state = fromAuth.authReducer(authInitialState, routerNavigatedAction);
      expect(state).toEqual(authInitialState);
    });
  });
});
