import { createFeature, createReducer, on } from '@ngrx/store';
import { newArticleActions } from './new-article.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { BackendErrors } from '@shared/data-access/models';

export interface NewArticleState {
  submitting: boolean;
  errors: BackendErrors | null;
}

const initialState: NewArticleState = {
  submitting: false,
  errors: null
};

const newArticleFeature = createFeature({
  name: 'newArticle',
  reducer: createReducer(
    initialState,
    on(
      newArticleActions.newArticle,
      (state): NewArticleState => ({
        ...state,
        submitting: true
      })
    ),
    on(
      newArticleActions.newArticleSuccess,
      (state): NewArticleState => ({
        ...state,
        submitting: false
      })
    ),
    on(
      newArticleActions.newArticleFailure,
      (state, { errors }): NewArticleState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): NewArticleState => initialState)
  )
});

export const {
  name: newArticleFeatureKey,
  reducer: newArticleReducer,
  selectSubmitting,
  selectErrors
} = newArticleFeature;
