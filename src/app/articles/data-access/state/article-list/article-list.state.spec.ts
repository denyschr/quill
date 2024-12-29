import * as fromArticleList from './article-list.state';
import { articleListActions } from './article-list.actions';
import { ArticleListConfig, ArticleListResponse } from '@shared/data-access/models';

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
    it('should update the page', () => {
      const { articleListInitialState } = fromArticleList;
      const page = 2;
      const filters = {
        ...articleListInitialState.config.filters,
        offset: (articleListInitialState.config.filters?.limit ?? 10) * (page - 1)
      };
      const config = {
        ...articleListInitialState.config,
        currentPage: page,
        filters
      };
      const newState = {
        ...articleListInitialState,
        config
      };
      const action = articleListActions.setPage({ page });
      const state = fromArticleList.articleListReducer(articleListInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleListInitialState);
    });
  });

  describe('setConfig action', () => {
    it('should update the config', () => {
      const { articleListInitialState } = fromArticleList;
      const config = {
        ...articleListInitialState.config,
        type: 'feed'
      } as ArticleListConfig;
      const newState = {
        ...articleListInitialState,
        config
      };
      const action = articleListActions.setConfig({ config });
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
      const articleList = {
        articles: [{ title: 'title one' }, { title: 'title two' }],
        articlesCount: 2
      } as ArticleListResponse;
      const newState = {
        ...articleListInitialState,
        articles: articleList.articles,
        total: articleList.articlesCount,
        loading: false
      };
      const action = articleListActions.loadArticlesSuccess({
        articles: articleList.articles,
        total: articleList.articlesCount
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
