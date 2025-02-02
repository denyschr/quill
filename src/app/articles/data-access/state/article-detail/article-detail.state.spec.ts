import * as fromArticle from './article-detail.state';
import { routerNavigationAction } from '@ngrx/router-store';
import { articleDetailActions } from './article-detail.actions';
import { getMockedArticle } from '@app/testing.spec';

describe('ArticleDetailState', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { articleDetailInitialState } = fromArticle;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticle.articleDetailReducer(articleDetailInitialState, action);

      expect(state).toBe(articleDetailInitialState);
    });
  });

  describe('loadArticle action', () => {
    it('should set loading to true', () => {
      const { articleDetailInitialState } = fromArticle;
      const newState = {
        ...articleDetailInitialState,
        loading: true
      };
      const action = articleDetailActions.loadArticle({ slug: 'article-slug' });
      const state = fromArticle.articleDetailReducer(articleDetailInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleDetailInitialState);
    });

    it('should retrieve an article and set loading to false on success', () => {
      const { articleDetailInitialState } = fromArticle;
      const article = getMockedArticle();
      const newState = {
        ...articleDetailInitialState,
        article,
        loading: false
      };
      const action = articleDetailActions.loadArticleSuccess({ article });
      const state = fromArticle.articleDetailReducer(articleDetailInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleDetailInitialState);
    });

    it('should set loading to false on failure', () => {
      const { articleDetailInitialState } = fromArticle;
      const newState = {
        ...articleDetailInitialState,
        loading: false
      };
      const action = articleDetailActions.loadArticleFailure();
      const state = fromArticle.articleDetailReducer(articleDetailInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleDetailInitialState);
    });
  });

  describe('routerNavigationAction action', () => {
    it('should reset to the initial state', () => {
      const { articleDetailInitialState } = fromArticle;
      const state = fromArticle.articleDetailReducer(
        articleDetailInitialState,
        routerNavigationAction
      );
      expect(state).toEqual(articleDetailInitialState);
    });
  });
});
