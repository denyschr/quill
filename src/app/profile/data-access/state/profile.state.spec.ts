import * as fromProfile from './profile.state';
import { profileActions } from './profile.actions';
import { Profile } from '@app/profile/data-access/models';

describe('ProfileState', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { profileInitialState } = fromProfile;
      const action = {
        type: 'Unknown'
      };
      const state = fromProfile.profileReducer(profileInitialState, action);

      expect(state).toBe(profileInitialState);
    });
  });

  describe('loadProfile action', () => {
    it('should set loading to true', () => {
      const { profileInitialState } = fromProfile;
      const newState = {
        ...profileInitialState,
        loading: true
      };
      const action = profileActions.loadProfile({ username: 'username' });
      const state = fromProfile.profileReducer(profileInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(profileInitialState);
    });

    it('should retrieve a user profile and set loading to false on success', () => {
      const { profileInitialState } = fromProfile;
      const profile = { username: 'username' } as Profile;
      const newState = {
        ...profileInitialState,
        profile,
        loading: false
      };
      const action = profileActions.loadProfileSuccess({ profile });
      const state = fromProfile.profileReducer(profileInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(profileInitialState);
    });

    it('should set loading to false on failure', () => {
      const { profileInitialState } = fromProfile;
      const newState = {
        ...profileInitialState,
        loading: false
      };
      const action = profileActions.loadProfileFailure();
      const state = fromProfile.profileReducer(profileInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(profileInitialState);
    });
  });
});
