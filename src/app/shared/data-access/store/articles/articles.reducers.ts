import { createFeature, createReducer, on } from '@ngrx/store';
import { articlesActions } from './articles.actions';
import { ArticlesStateModel } from '@shared/data-access/models';

export const initialState: ArticlesStateModel = {
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
      (state): ArticlesStateModel => ({
        ...state,
        data: null,
        loading: true,
        error: null
      })
    ),
    on(
      articlesActions.getArticlesSuccess,
      (state, { data }): ArticlesStateModel => ({
        ...state,
        data: data,
        loading: false,
        error: null
      })
    ),
    on(
      articlesActions.getArticlesFailure,
      (state, { error }): ArticlesStateModel => ({
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
