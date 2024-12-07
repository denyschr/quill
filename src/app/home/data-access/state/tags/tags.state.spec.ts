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

    it('should have no error and no loading state if success', () => {
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

    it('should have no loading state if failed', () => {
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
