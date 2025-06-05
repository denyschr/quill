import * as fromSettings from './settings.state';

import { authActions } from '@/app/auth/data-access/state';
import { User } from '@/app/auth/data-access/models';

describe('SettingsState', () => {
  const mockUser = { username: 'jack' } as User;

  describe('unknown action', () => {
    it('should return the default state', () => {
      const { settingsInitialState } = fromSettings;
      const action = {
        type: 'Unknown'
      };
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toBe(settingsInitialState);
    });
  });

  describe('updateCurrentUser action', () => {
    it('should set submitting to true and reset errors to null', () => {
      const { settingsInitialState } = fromSettings;
      const newState = {
        ...settingsInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.updateCurrentUser({ user: mockUser });
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(settingsInitialState);
    });

    it('should set submitting to false on success', () => {
      const { settingsInitialState } = fromSettings;
      const newState = {
        ...settingsInitialState,
        submitting: false
      };
      const action = authActions.updateCurrentUserSuccess({ currentUser: mockUser });
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(settingsInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { settingsInitialState } = fromSettings;
      const mockErrors = { email: ['already exists'] };
      const newState = {
        ...settingsInitialState,
        submitting: false,
        errors: mockErrors
      };
      const action = authActions.updateCurrentUserFailure({ errors: mockErrors });
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(settingsInitialState);
    });
  });
});
