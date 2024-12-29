import * as fromTags from './tags.state';
import { tagsActions } from './tags.actions';

describe('TagsState', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { tagsInitialState } = fromTags;
      const action = {
        type: 'Unknown'
      };
      const state = fromTags.tagsReducer(tagsInitialState, action);

      expect(state).toBe(tagsInitialState);
    });
  });

  describe('loadTags action', () => {
    it('should set loading to true', () => {
      const { tagsInitialState } = fromTags;
      const newState = {
        ...tagsInitialState,
        loading: true
      };
      const action = tagsActions.loadTags();
      const state = fromTags.tagsReducer(tagsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(tagsInitialState);
    });

    it('should retrieve an array of tags and set loading to false on success', () => {
      const { tagsInitialState } = fromTags;
      const tags = ['tag one', 'tag two'];
      const newState = {
        ...tagsInitialState,
        tags: tags,
        loading: false
      };
      const action = tagsActions.loadTagsSuccess({ tags });
      const state = fromTags.tagsReducer(tagsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(tagsInitialState);
    });

    it('should set loading to false on failure', () => {
      const { tagsInitialState } = fromTags;
      const newState = {
        ...tagsInitialState,
        loading: false
      };
      const action = tagsActions.loadTagsFailure();
      const state = fromTags.tagsReducer(tagsInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(tagsInitialState);
    });
  });
});
