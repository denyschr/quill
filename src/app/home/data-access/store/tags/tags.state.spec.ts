import * as fromTags from './tags.state';
import { tagsActions } from './tags.actions';

describe('TagsReducers', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTags;
      const action = {
        type: 'Unknown'
      };
      const state = fromTags.tagsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('getPopularTags action', () => {
    it('should retrieve a list of tags', () => {
      const { initialState } = fromTags;
      const newState = {
        ...initialState,
        loading: true
      };
      const action = tagsActions.getTags();
      const state = fromTags.tagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state after successful retrieval of tags', () => {
      const hardcodedTags = ['esse', 'at', 'ipsum', 'sunt', 'maiores'];

      const { initialState } = fromTags;
      const newState = {
        ...initialState,
        tags: hardcodedTags,
        loading: false
      };
      const action = tagsActions.getTagsSuccess({ tags: hardcodedTags });
      const state = fromTags.tagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state if the retrieval of tags fails', () => {
      const { initialState } = fromTags;
      const newState = {
        ...initialState,
        tags: null,
        loading: false,
        error: 'Some error'
      };
      const action = tagsActions.getTagsFailure({ error: 'Some error' });
      const state = fromTags.tagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
