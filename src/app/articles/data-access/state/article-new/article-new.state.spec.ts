import * as fromArticleNew from './article-new.state';
import { articleNewActions } from './article-new.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { getMockedArticle } from '@app/testing.spec';

describe('ArticleNewState', () => {
  const article = getMockedArticle();

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
    it('should set submitting to true and reset errors to null', () => {
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
      const errors = { title: ['is a required field'], body: ['is a required field'] };
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

  describe('routerNavigationAction action', () => {
    it('should reset to the initial state', () => {
      const { articleNewInitialState } = fromArticleNew;
      const state = fromArticleNew.articleNewReducer(
        articleNewInitialState,
        routerNavigationAction
      );
      expect(state).toEqual(articleNewInitialState);
    });
  });
});
