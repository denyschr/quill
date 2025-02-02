import * as fromArticleEdit from './article-edit.state';
import { articleEditActions } from './article-edit.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { getMockedArticle } from '@app/testing.spec';

describe('ArticleEditState', () => {
  const article = getMockedArticle();

  describe('unknown action', () => {
    it('should return the default state', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const action = {
        type: 'Unknown'
      };
      const state = fromArticleEdit.articleEditReducer(articleEditInitialState, action);

      expect(state).toBe(articleEditInitialState);
    });
  });

  describe('editArticle action', () => {
    it('should set submitting to true and reset errors to null', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const newState = {
        ...articleEditInitialState,
        submitting: true,
        errors: null
      };
      const action = articleEditActions.editArticle({ slug: article.slug, article });
      const state = fromArticleEdit.articleEditReducer(articleEditInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleEditInitialState);
    });

    it('should set submitting to false on success', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const newState = {
        ...articleEditInitialState,
        submitting: false
      };
      const action = articleEditActions.editArticleSuccess({ article });
      const state = fromArticleEdit.articleEditReducer(articleEditInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleEditInitialState);
    });

    it('should have errors and set submitting to false on failure', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const errors = { title: ['is a required field'], body: ['is a required field'] };
      const newState = {
        ...articleEditInitialState,
        submitting: false,
        errors
      };
      const action = articleEditActions.editArticleFailure({ errors });
      const state = fromArticleEdit.articleEditReducer(articleEditInitialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(articleEditInitialState);
    });
  });

  describe('routerNavigationAction action', () => {
    it('should reset to the initial state', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const state = fromArticleEdit.articleEditReducer(
        articleEditInitialState,
        routerNavigationAction
      );
      expect(state).toEqual(articleEditInitialState);
    });
  });
});
