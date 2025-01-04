import * as fromArticleNew from './article-new.state';
import { Article } from '@shared/data-access/models';
import { articleNewActions } from './article-new.actions';
import { routerNavigationAction } from '@ngrx/router-store';

describe('ArticleNewState', () => {
  const article = { title: 'title one' } as Article;

  describe('unknown action', () => {
    it('should return the default state', () => {
      const { articleNewInitialState } = fromArticleNew;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticleNew.articleNewReducer(articleNewInitialState, action);

      expect(state).toBe(articleNewInitialState);
    });
  });

  describe('newArticle action', () => {
    it('should set submitting to true and reset the error state to null', () => {
      const { articleNewInitialState } = fromArticleNew;
      const newState = {
        ...articleNewInitialState,
        submitting: true,
        errors: null
      };
      const action = articleNewActions.newArticle({ article });
      const state = fromArticleNew.articleNewReducer(articleNewInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleNewInitialState);
    });

    it('should set submitting to false on success', () => {
      const { articleNewInitialState } = fromArticleNew;
      const newState = {
        ...articleNewInitialState,
        submitting: false
      };
      const action = articleNewActions.newArticleSuccess({ article });
      const state = fromArticleNew.articleNewReducer(articleNewInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleNewInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { articleNewInitialState } = fromArticleNew;
      const errors = { title: ['is missing'], body: ['is required'] };
      const newState = {
        ...articleNewInitialState,
        submitting: false,
        errors
      };
      const action = articleNewActions.newArticleFailure({ errors });
      const state = fromArticleNew.articleNewReducer(articleNewInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleNewInitialState);
    });
  });

  describe('routerNavigationAction', () => {
    it('should reset the state to its initial values on navigation', () => {
      const { articleNewInitialState } = fromArticleNew;
      const state = fromArticleNew.articleNewReducer(
        articleNewInitialState,
        routerNavigationAction
      );
      expect(state).toEqual(articleNewInitialState);
    });
  });
});
