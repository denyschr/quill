import * as fromArticle from './article.state';
import { articleActions } from './article.actions';
import { Article } from '@shared/data-access/models';
import { routerNavigationAction } from '@ngrx/router-store';

describe('ArticleState', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { articleInitialState } = fromArticle;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticle.articleReducer(articleInitialState, action);

      expect(state).toBe(articleInitialState);
    });
  });

  describe('loadArticle action', () => {
    it('should set loading to true', () => {
      const { articleInitialState } = fromArticle;
      const newState = {
        ...articleInitialState,
        loading: true
      };
      const action = articleActions.loadArticle({ slug: 'slug' });
      const state = fromArticle.articleReducer(articleInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleInitialState);
    });

    it('should retrieve an article and set loading to false on success', () => {
      const { articleInitialState } = fromArticle;
      const article = { title: 'title one' } as Article;
      const newState = {
        ...articleInitialState,
        article,
        loading: false
      };
      const action = articleActions.loadArticleSuccess({ article });
      const state = fromArticle.articleReducer(articleInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleInitialState);
    });

    it('should set loading to false on failure', () => {
      const { articleInitialState } = fromArticle;
      const newState = {
        ...articleInitialState,
        loading: false
      };
      const action = articleActions.loadArticleFailure();
      const state = fromArticle.articleReducer(articleInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleInitialState);
    });
  });

  describe('routerNavigationAction', () => {
    it('should reset the state to its initial values on navigation', () => {
      const { articleInitialState } = fromArticle;
      const state = fromArticle.articleReducer(articleInitialState, routerNavigationAction);
      expect(state).toEqual(articleInitialState);
    });
  });
});
