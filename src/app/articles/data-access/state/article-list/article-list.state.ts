import { createFeature, createReducer, on } from '@ngrx/store';
import { articleListActions } from './article-list.actions';
import { Article, ArticleListConfig } from '@shared/data-access/models';
import { environment } from '@environment';

export interface ArticleListState {
  articles: Article[];
  total: number;
  config: ArticleListConfig;
  loading: boolean;
}

export const articleListInitialState: ArticleListState = {
  articles: [],
  total: 0,
  config: {
    type: 'global',
    currentPage: 1,
    filters: {
      limit: environment.limit
    }
  },
  loading: false
};

const articleListFeature = createFeature({
  name: 'articleList',
  reducer: createReducer(
    articleListInitialState,
    on(articleListActions.setPage, (state, { page }): ArticleListState => {
      const filters = {
        ...state.config.filters,
        offset: (state.config.filters?.limit ?? 10) * (page - 1)
      };
      const config = {
        ...state.config,
        currentPage: page,
        filters
      };
      return { ...state, config };
    }),
    on(
      articleListActions.setConfig,
      (state, { config }): ArticleListState => ({
        ...state,
        config
      })
    ),
    on(
      articleListActions.loadArticles,
      (state): ArticleListState => ({
        ...state,
        loading: true
      })
    ),
    on(
      articleListActions.loadArticlesSuccess,
      (state, { articles, total }): ArticleListState => ({
        ...state,
        articles,
        total,
        loading: false
      })
    ),
    on(
      articleListActions.loadArticlesFailure,
      (state): ArticleListState => ({
        ...state,
        loading: false
      })
    ),
    on(
      articleListActions.favoriteSuccess,
      articleListActions.unfavoriteSuccess,
      (state, { article }): ArticleListState => {
        const articles = state.articles.map(a => (a.slug === article.slug ? article : a));
        return { ...state, articles };
      }
    )
  )
});

export const {
  name: articleListFeatureKey,
  reducer: articleListReducer,
  selectArticles,
  selectTotal,
  selectConfig,
  selectLoading
} = articleListFeature;
