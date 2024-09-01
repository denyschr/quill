import { LoginCredentialsModel, RegisterCredentialsModel } from '@auth/data-access/models';
import * as fromAuth from './auth.reducers';
import { authActions } from './auth.actions';

describe('AuthReducers', () => {
  const user = {
    email: 'denys@gmail.com',
    token: 'eyJ1c9VyIj7ImlkIjoz0DV9LCJpYXQmOjE3MjUxMjk1NzEsImV4cCI6MTczMDMxMzU3MX0',
    username: 'denys',
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
  };
  const errors = {
    error: ['something went wrong...']
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
    it('should initiate the registration', () => {
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

    it('should update the state after successful registration', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user,
        submitting: false,
        errors: null
      };
      const action = authActions.registerSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state if the registration fails', () => {
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
    it('should initiate the login', () => {
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

    it('should update the state after successful login', () => {
      const { initialState } = fromAuth;
      const newState = {
        ...initialState,
        currentUser: user,
        submitting: false,
        errors: null
      };
      const action = authActions.loginSuccess({ currentUser: user });
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state if the login fails', () => {
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
    it('should retrieve the user', () => {
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

    it('should update the state after successful retrieval of the user', () => {
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

    it('should update the state if the retrieval of the user fails', () => {
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
});
