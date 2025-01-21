import * as fromSettings from './settings.state';
import { authActions } from '@app/auth/data-access/state';
import { User } from '@app/shared/data-access/api/models';

describe('SettingsState', () => {
  const user = { username: 'username' } as User;

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
    it('should set submitting to true and reset the error state to null', () => {
      const { settingsInitialState } = fromSettings;
      const newState = {
        ...settingsInitialState,
        submitting: true,
        errors: null
      };
      const action = authActions.updateCurrentUser({ user });
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
      const action = authActions.updateCurrentUserSuccess({ currentUser: user });
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(settingsInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { settingsInitialState } = fromSettings;
      const errors = { email: ['already exists'] };
      const newState = {
        ...settingsInitialState,
        submitting: false,
        errors
      };
      const action = authActions.updateCurrentUserFailure({ errors });
      const state = fromSettings.settingsReducer(settingsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(settingsInitialState);
    });
  });
});
