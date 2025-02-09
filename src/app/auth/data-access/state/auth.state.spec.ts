import * as fromAuth from './auth.state';
import { authActions } from './auth.actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { User } from '@app/auth/data-access/models';

describe('AuthState', () => {
  const mockUser = { username: 'jack' } as User;
  const mockErrors = {
    email: ['already exists'],
    password: ['is invalid']
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
        currentUser: mockUser,
        loading: false
      };
      const action = authActions.getCurrentUserSuccess({ currentUser: mockUser });
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
        currentUser: mockUser
      };
      const action = authActions.updateCurrentUserSuccess({ currentUser: mockUser });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('register action', () => {
    it('should set submitting to true and reset errors to null', () => {
      const { authInitialState } = fromAuth;
      const mockCredentials = { username: 'jack', email: 'jack@email.tld', password: '1234' };
      const newState = {
        ...authInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.register({ credentials: mockCredentials });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should register a user and set submitting to false on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: mockUser,
        submitting: false
      };
      const action = authActions.registerSuccess({ currentUser: mockUser });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        submitting: false,
        errors: mockErrors
      };
      const action = authActions.registerFailure({ errors: mockErrors });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });
  });

  describe('login action', () => {
    it('should set submitting to true and reset errors to null', () => {
      const { authInitialState } = fromAuth;
      const mockCredentials = { email: 'jack@email.tld', password: '1234' };
      const newState = {
        ...authInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.login({ credentials: mockCredentials });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should log in a user and set submitting to false on success', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        currentUser: mockUser,
        submitting: false
      };
      const action = authActions.loginSuccess({ currentUser: mockUser });
      const state = fromAuth.authReducer(authInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(authInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { authInitialState } = fromAuth;
      const newState = {
        ...authInitialState,
        submitting: false,
        errors: mockErrors
      };
      const action = authActions.loginFailure({ errors: mockErrors });
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

  describe('routerNavigatedAction action', () => {
    it('should reset errors to null', () => {
      const { authInitialState } = fromAuth;
      const state = fromAuth.authReducer(authInitialState, routerNavigatedAction);
      expect(state).toEqual(authInitialState);
    });
  });
});
