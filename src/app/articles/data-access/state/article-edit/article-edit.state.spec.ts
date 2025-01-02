import * as fromArticleEdit from './article-edit.state';
import { articleEditActions } from './article-edit.actions';
import { Article } from '@shared/data-access/models';
import { routerNavigationAction } from '@ngrx/router-store';

describe('ArticleEditState', () => {
  const article = { title: 'title one' } as Article;

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
    it('should set submitting to true and reset the error state to null', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const newState = {
        ...articleEditInitialState,
        submitting: true,
        errors: null
      };
      const action = articleEditActions.editArticle({ slug: 'title-one', article });
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
      const errors = { title: ['is missing'], body: ['is required'] };
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

  describe('routerNavigationAction', () => {
    it('should reset the state to its initial values on navigation', () => {
      const { articleEditInitialState } = fromArticleEdit;
      const state = fromArticleEdit.articleEditReducer(
        articleEditInitialState,
        routerNavigationAction
      );
      expect(state).toEqual(articleEditInitialState);
    });
  });
});
