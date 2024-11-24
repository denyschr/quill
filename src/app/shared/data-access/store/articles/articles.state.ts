import { createFeature, createReducer, on } from '@ngrx/store';
import { articlesActions } from './articles.actions';
import { Article, ArticleListConfig } from '@shared/data-access/models';
import { environment } from '@environment';

export interface ArticlesState {
  articles: Article[];
  articlesCount: number;
  config: ArticleListConfig;
  loading: boolean;
}

export const articlesInitialState: ArticlesState = {
  articles: [],
  articlesCount: 0,
  config: {
    type: 'all',
    currentPage: 1,
    filters: {
      limit: environment.limit
    }
  },
  loading: false
};

const articlesFeature = createFeature({
  name: 'articles',
  reducer: createReducer(
    articlesInitialState,
    on(articlesActions.setPage, (state, { page }): ArticlesState => {
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
      articlesActions.setConfig,
      (state, { config }): ArticlesState => ({
        ...state,
        config
      })
    ),
    on(
      articlesActions.loadArticles,
      (state): ArticlesState => ({
        ...state,
        loading: true
      })
    ),
    on(
      articlesActions.loadArticlesSuccess,
      (state, { articles, articlesCount }): ArticlesState => ({
        ...state,
        articles,
        articlesCount,
        loading: false
      })
    ),
    on(
      articlesActions.loadArticlesFailure,
      (state): ArticlesState => ({
        ...state,
        loading: false
      })
    )
  )
});

export const {
  name: articlesFeatureKey,
  reducer: articlesReducer,
  selectArticles,
  selectArticlesCount,
  selectConfig,
  selectLoading
} = articlesFeature;
