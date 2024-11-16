import { createFeature, createReducer, on } from '@ngrx/store';
import { articleActions } from './article.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { Article } from '@shared/data-access/models';

export interface ArticleState {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
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
      (state): ArticleState => ({
        ...state,
        loading: true
      })
    ),
    on(
      articleActions.getArticleSuccess,
      (state, { article }): ArticleState => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      articleActions.getArticleFailure,
      (state, { error }): ArticleState => ({
        ...state,
        loading: false,
        error: error
      })
    ),
    on(routerNavigationAction, (): ArticleState => initialState)
  )
});

export const {
  name: articleFeatureKey,
  reducer: articleReducer,
  selectArticle,
  selectLoading,
  selectError
} = articleFeature;
