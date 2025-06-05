import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';

import { Article } from '../../models';

import { articleListActions } from '../article-list';

import { articleDetailActions } from './article-detail.actions';

export interface ArticleDetailState {
  article: Article | null;
  loading: boolean;
}

export const articleDetailInitialState: ArticleDetailState = {
  article: null,
  loading: false
};

const articleDetailFeature = createFeature({
  name: 'articleDetail',
  reducer: createReducer(
    articleDetailInitialState,
    on(
      articleDetailActions.loadArticle,
      (state): ArticleDetailState => ({
        ...state,
        loading: true
      })
    ),
    on(
      articleDetailActions.loadArticleSuccess,
      (state, { article }): ArticleDetailState => ({
        ...state,
        article: article,
        loading: false
      })
    ),
    on(
      articleDetailActions.loadArticleFailure,
      (state): ArticleDetailState => ({
        ...state,
        loading: false
      })
    ),
    on(
      articleDetailActions.followSuccess,
      articleDetailActions.unfollowSuccess,
      (state, { profile }): ArticleDetailState => {
        if (!state.article) {
          return state;
        }
        const article = { ...state.article, author: profile };
        return { ...state, article };
      }
    ),
    on(
      articleListActions.favoriteSuccess,
      articleListActions.unfavoriteSuccess,
      (state, { article }): ArticleDetailState => ({
        ...state,
        article
      })
    ),
    on(routerNavigationAction, (): ArticleDetailState => articleDetailInitialState)
  )
});

export const {
  name: articleDetailFeatureKey,
  reducer: articleDetailReducer,
  selectArticle,
  selectLoading
} = articleDetailFeature;
