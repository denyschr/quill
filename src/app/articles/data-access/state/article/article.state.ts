import { createFeature, createReducer, on } from '@ngrx/store';
import { articleActions } from './article.actions';
import { routerNavigationAction } from '@ngrx/router-store';
import { Article } from '@shared/data-access/models';
import { articleListActions } from '@articles/data-access/state/article-list';

export interface ArticleState {
  article: Article | null;
  loading: boolean;
}

export const articleInitialState: ArticleState = {
  article: null,
  loading: false
};

const articleFeature = createFeature({
  name: 'article',
  reducer: createReducer(
    articleInitialState,
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
    on(
      articleListActions.favoriteSuccess,
      articleListActions.unfavoriteSuccess,
      (state, { article }): ArticleState => ({
        ...state,
        article
      })
    ),
    on(routerNavigationAction, (): ArticleState => articleInitialState)
  )
});

export const {
  name: articleFeatureKey,
  reducer: articleReducer,
  selectArticle,
  selectLoading
} = articleFeature;
