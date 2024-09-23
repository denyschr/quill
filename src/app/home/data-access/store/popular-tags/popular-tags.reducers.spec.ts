import * as fromPopularTags from './popular-tags.reducers';
import { popularTagsActions } from './popular-tags.actions';

describe('PopularTagsReducers', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromPopularTags;
      const action = {
        type: 'Unknown'
      };
      const state = fromPopularTags.popularTagsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('getPopularTags action', () => {
    it('should retrieve a list of popular tags', () => {
      const { initialState } = fromPopularTags;
      const newState = {
        ...initialState,
        loading: true
      };
      const action = popularTagsActions.getPopularTags();
      const state = fromPopularTags.popularTagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state after successful retrieval of popular tags', () => {
      const hardcodedTags: string[] = ['esse', 'at', 'ipsum', 'sunt', 'maiores'];

      const { initialState } = fromPopularTags;
      const newState = {
        ...initialState,
        tags: hardcodedTags,
        loading: false
      };
      const action = popularTagsActions.getPopularTagsSuccess({ tags: hardcodedTags });
      const state = fromPopularTags.popularTagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state if the retrieval of popular tags fails', () => {
      const { initialState } = fromPopularTags;
      const newState = {
        ...initialState,
        tags: null,
        loading: false,
        error: 'Some error'
      };
      const action = popularTagsActions.getPopularTagsFailure({ error: 'Some error' });
      const state = fromPopularTags.popularTagsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
