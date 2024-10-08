import { createFeature, createReducer, on } from '@ngrx/store';
import { articleActions } from './article.actions';
import { ArticleStateModel } from '@article/data-access/models';
import { routerNavigationAction } from '@ngrx/router-store';

export const initialState: ArticleStateModel = {
  article: null,
  loading: false,
  error: null
};

const articleFeature = createFeature({
  name: 'article',
  reducer: createReducer(
    initialState,
    on(
      articleActions.getArticle,
      (state): ArticleStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      articleActions.getArticleSuccess,
      (state, { article }): ArticleStateModel => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      articleActions.getArticleFailure,
      (state, { error }): ArticleStateModel => ({
        ...state,
        loading: false,
        error: error
      })
    ),
    on(routerNavigationAction, (): ArticleStateModel => initialState)
  )
});

export const {
  name: articleFeatureKey,
  reducer: articleReducer,
  selectArticle,
  selectLoading,
  selectError
} = articleFeature;
