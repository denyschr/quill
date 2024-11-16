import { createFeature, createReducer, on } from '@ngrx/store';
import { articlesActions } from './articles.actions';
import { ArticleListResponse } from '@shared/data-access/models';

export interface ArticlesState {
  data: ArticleListResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ArticlesState = {
  data: null,
  loading: false,
  error: null
};

const articlesFeature = createFeature({
  name: 'articles',
  reducer: createReducer(
    initialState,
    on(
      articlesActions.getArticles,
      (state): ArticlesState => ({
        ...state,
        data: null,
        loading: true,
        error: null
      })
    ),
    on(
      articlesActions.getArticlesSuccess,
      (state, { data }): ArticlesState => ({
        ...state,
        data: data,
        loading: false,
        error: null
      })
    ),
    on(
      articlesActions.getArticlesFailure,
      (state, { error }): ArticlesState => ({
        ...state,
        loading: false,
        error: error
      })
    )
  )
});

export const {
  name: articlesFeatureKey,
  reducer: articlesReducer,
  selectData: selectArticlesData,
  selectLoading,
  selectError
} = articlesFeature;
