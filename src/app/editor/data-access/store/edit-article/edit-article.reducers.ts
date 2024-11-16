import { createFeature, createReducer, on } from '@ngrx/store';
import { editArticleActions } from './edit-article.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { Article, BackendErrors } from '@shared/data-access/models';

export interface EditArticleState {
  article: Article | null;
  submitting: boolean;
  loading: boolean;
  errors: BackendErrors | null;
}

const initialState: EditArticleState = {
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
      (state): EditArticleState => ({
        ...state,
        loading: true
      })
    ),
    on(
      editArticleActions.getArticleSuccess,
      (state, { article }): EditArticleState => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      editArticleActions.getArticleFailure,
      (state): EditArticleState => ({
        ...state,
        loading: false
      })
    ),
    on(
      editArticleActions.editArticle,
      (state): EditArticleState => ({
        ...state,
        submitting: true
      })
    ),
    on(
      editArticleActions.editArticleSuccess,
      (state): EditArticleState => ({
        ...state,
        submitting: false
      })
    ),
    on(
      editArticleActions.editArticleFailure,
      (state, { errors }): EditArticleState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): EditArticleState => initialState)
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
