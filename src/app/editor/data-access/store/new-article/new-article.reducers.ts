import { NewArticleStateModel } from '@editor/data-access/models';
import { createFeature, createReducer, on } from '@ngrx/store';
import { newArticleActions } from './new-article.actions';
import { routerNavigationAction } from '@ngrx/router-store';

const initialState: NewArticleStateModel = {
  submitting: false,
  errors: null
};

const newArticleFeature = createFeature({
  name: 'newArticle',
  reducer: createReducer(
    initialState,
    on(
      newArticleActions.newArticle,
      (state): NewArticleStateModel => ({
        ...state,
        submitting: true
      })
    ),
    on(
      newArticleActions.newArticleSuccess,
      (state): NewArticleStateModel => ({
        ...state,
        submitting: false
      })
    ),
    on(
      newArticleActions.newArticleFailure,
      (state, { errors }): NewArticleStateModel => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): NewArticleStateModel => initialState)
  )
});

export const {
  name: newArticleFeatureKey,
  reducer: newArticleReducer,
  selectSubmitting,
  selectErrors
} = newArticleFeature;
