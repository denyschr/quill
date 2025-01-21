import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { BackendErrors } from '@app/shared/data-access/api/models';
import { articleNewActions } from './article-new.actions';

export interface ArticleNewState {
  submitting: boolean;
  errors: BackendErrors | null;
}

export const articleNewInitialState: ArticleNewState = {
  submitting: false,
  errors: null
};

const articleNewFeature = createFeature({
  name: 'articleNew',
  reducer: createReducer(
    articleNewInitialState,
    on(
      articleNewActions.newArticle,
      (state): ArticleNewState => ({
        ...state,
        submitting: true,
        errors: null
      })
    ),
    on(
      articleNewActions.newArticleSuccess,
      (state): ArticleNewState => ({
        ...state,
        submitting: false
      })
    ),
    on(
      articleNewActions.newArticleFailure,
      (state, { errors }): ArticleNewState => ({
        ...state,
        submitting: false,
        errors: errors
      })
    ),
    on(routerNavigationAction, (): ArticleNewState => articleNewInitialState)
  )
});

export const {
  name: articleNewFeatureKey,
  reducer: articleNewReducer,
  selectSubmitting,
  selectErrors
} = articleNewFeature;
