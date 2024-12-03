import { ArticleListResponse } from '@shared/data-access/models';
import { articleListActions } from './article-list.actions';
import * as fromArticles from './article-list.state';

describe('ArticlesReducers', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromArticles;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticles.articlesReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('getArticles action', () => {
    it('should retrieve a list of articles', () => {
      const { initialState } = fromArticles;
      const newState = {
        ...initialState,
        data: null,
        loading: true,
        error: null
      };
      const action = articleListActions.getArticles({ config: { type: 'all', filters: {} } });
      const state = fromArticles.articlesReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state after successful retrieval of articles', () => {
      const hardcodedArticles = {
        articles: [
          {
            title: 'How to train your dragon'
          },
          {
            title: 'How to train your dragon 2'
          }
        ],
        articlesCount: 2
      } as ArticleListResponse;

      const { initialState } = fromArticles;
      const newState = {
        ...initialState,
        data: hardcodedArticles,
        loading: false
      };
      const action = articleListActions.getArticlesSuccess({ data: hardcodedArticles });
      const state = fromArticles.articlesReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should update the state if the retrieval of articles fails', () => {
      const { initialState } = fromArticles;
      const newState = {
        ...initialState,
        data: null,
        loading: false,
        error: 'Some error'
      };
      const action = articleListActions.getArticlesFailure({ error: 'Some error' });
      const state = fromArticles.articlesReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
