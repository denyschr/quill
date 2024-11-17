import * as fromTags from './tags.state';
import { tagsActions } from './tags.actions';

describe('TagsState', () => {
  describe('Reducers', () => {
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

    describe('getTags action', () => {
      it('should set loading to true', () => {
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

      it('should have no error and no loading state if success', () => {
        const { initialState } = fromTags;
        const tags = ['tag one', 'tag two'];
        const newState = {
          ...initialState,
          tags: tags,
          loading: false
        };
        const action = tagsActions.getTagsSuccess({ tags });
        const state = fromTags.tagsReducer(initialState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(initialState);
      });

      it('should have no loading state if failed', () => {
        const { initialState } = fromTags;
        const newState = {
          ...initialState,
          loading: false
        };
        const action = tagsActions.getTagsFailure();
        const state = fromTags.tagsReducer(initialState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(initialState);
      });
    });
  });
});
