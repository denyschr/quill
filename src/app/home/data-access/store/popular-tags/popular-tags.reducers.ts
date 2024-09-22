import { createFeature, createReducer, on } from '@ngrx/store';
import { popularTagsActions } from './popular-tags.actions';
import { PopularTagsStateModel } from '@home/data-access/models';

export const initialState: PopularTagsStateModel = {
  tags: null,
  loading: false,
  error: null
};

const popularTagsFeature = createFeature({
  name: 'popularTags',
  reducer: createReducer(
    initialState,
    on(
      popularTagsActions.getPopularTags,
      (state): PopularTagsStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      popularTagsActions.getPopularTagsSuccess,
      (state, { tags }): PopularTagsStateModel => ({
        ...state,
        tags: tags,
        loading: false,
        error: null
      })
    ),
    on(
      popularTagsActions.getPopularTagsFailure,
      (state, { error }): PopularTagsStateModel => ({
        ...state,
        loading: false,
        error: error
      })
    )
  )
});

export const {
  name: popularTagsFeatureKey,
  reducer: popularTagsReducer,
  selectTags,
  selectLoading,
  selectError
} = popularTagsFeature;
