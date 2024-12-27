import { createFeature, createReducer, on } from '@ngrx/store';
import { articleActions } from './article.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { Article } from '@shared/data-access/models';

export interface ArticleState {
  article: Article | null;
  loading: boolean;
}

const initialState: ArticleState = {
  article: null,
  loading: false
};

const articleFeature = createFeature({
  name: 'article',
  reducer: createReducer(
    initialState,
    on(
      articleActions.loadArticle,
      (state): ArticleState => ({
        ...state,
        loading: true
      })
    ),
    on(
      articleActions.loadArticleSuccess,
      (state, { article }): ArticleState => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      articleActions.loadArticleFailure,
      (state): ArticleState => ({
        ...state,
        loading: false
      })
    ),
    on(routerNavigationAction, (): ArticleState => initialState)
  )
});

export const {
  name: articleFeatureKey,
  reducer: articleReducer,
  selectArticle,
  selectLoading
} = articleFeature;
