import { EditArticleStateModel } from '@editor/data-access/models';
import { createFeature, createReducer, on } from '@ngrx/store';
import { editArticleActions } from './edit-article.actions';
import { routerNavigationAction } from '@ngrx/router-store';

const initialState: EditArticleStateModel = {
  article: null,
  loading: false,
  submitting: false,
  errors: null
};

const editArticleFeature = createFeature({
  name: 'editArticle',
  reducer: createReducer(
    initialState,
    on(
      editArticleActions.getArticle,
      (state): EditArticleStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      editArticleActions.getArticleSuccess,
      (state, { article }): EditArticleStateModel => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      editArticleActions.getArticleFailure,
      (state): EditArticleStateModel => ({
        ...state,
        loading: false
      })
    ),
    on(
      editArticleActions.editArticle,
      (state): EditArticleStateModel => ({
        ...state,
        submitting: true
      })
    ),
    on(
      editArticleActions.editArticleSuccess,
      (state): EditArticleStateModel => ({
        ...state,
        submitting: false
      })
    ),
    on(
      editArticleActions.editArticleFailure,
      (state, { errors }): EditArticleStateModel => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): EditArticleStateModel => initialState)
  )
});

export const {
  name: editArticleFeatureKey,
  reducer: editArticleReducer,
  selectArticle,
  selectLoading,
  selectSubmitting,
  selectErrors
} = editArticleFeature;
