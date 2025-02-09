import * as fromArticleList from './article-list.state';
import { articleListActions } from './article-list.actions';
import { ArticleListConfig, ArticleListResponse } from '@app/articles/data-access/models';

describe('ArticleListState', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { articleListInitialState } = fromArticleList;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toBe(articleListInitialState);
    });
  });

  describe('setPage action', () => {
    it('should change the page', () => {
      const { articleListInitialState } = fromArticleList;
      const mockPage = 2;
      const mockFilters = {
        ...articleListInitialState.config.filters,
        offset: (articleListInitialState.config.filters?.limit ?? 10) * (mockPage - 1)
      };
      const mockConfig = {
        ...articleListInitialState.config,
        currentPage: mockPage,
        filters: mockFilters
      };
      const newState = {
        ...articleListInitialState,
        config: mockConfig
      };
      const action = articleListActions.setPage({ page: mockPage });
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });
  });

  describe('setConfig action', () => {
    it('should update the config', () => {
      const { articleListInitialState } = fromArticleList;
      const mockConfig: ArticleListConfig = {
        ...articleListInitialState.config,
        type: 'feed'
      };
      const newState = {
        ...articleListInitialState,
        config: mockConfig
      };
      const action = articleListActions.setConfig({ config: mockConfig });
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });
  });

  describe('loadArticles action', () => {
    it('should set loading to true', () => {
      const { articleListInitialState } = fromArticleList;
      const newState = {
        ...articleListInitialState,
        loading: true
      };
      const action = articleListActions.loadArticles();
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });

    it('should retrieve a list of articles and set loading to false on success', () => {
      const { articleListInitialState } = fromArticleList;
      const mockArticles = {
        articles: [{ title: 'How to train your dragon' }, { title: 'How to train your dragon 2' }],
        articlesCount: 2
      } as ArticleListResponse;
      const newState = {
        ...articleListInitialState,
        articles: mockArticles.articles,
        total: mockArticles.articlesCount,
        loading: false
      };
      const action = articleListActions.loadArticlesSuccess({
        articles: mockArticles.articles,
        total: mockArticles.articlesCount
      });
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });

    it('should set loading to false on failure', () => {
      const { articleListInitialState } = fromArticleList;
      const newState = {
        ...articleListInitialState,
        loading: false
      };
      const action = articleListActions.loadArticlesFailure();
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });
  });
});
