import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { BackendErrors } from '@app/shared/data-access/api/models';
import { articleEditActions } from './article-edit.actions';

export interface ArticleEditState {
  submitting: boolean;
  errors: BackendErrors | null;
}

export const articleEditInitialState: ArticleEditState = {
  submitting: false,
  errors: null
};

const articleEditFeature = createFeature({
  name: 'articleEdit',
  reducer: createReducer(
    articleEditInitialState,
    on(
      articleEditActions.editArticle,
      (state): ArticleEditState => ({
        ...state,
        submitting: true,
        errors: null
      })
    ),
    on(
      articleEditActions.editArticleSuccess,
      (state): ArticleEditState => ({
        ...state,
        submitting: false
      })
    ),
    on(
      articleEditActions.editArticleFailure,
      (state, { errors }): ArticleEditState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): ArticleEditState => articleEditInitialState)
  )
});

export const {
  name: articleEditFeatureKey,
  reducer: articleEditReducer,
  selectSubmitting,
  selectErrors
} = articleEditFeature;
