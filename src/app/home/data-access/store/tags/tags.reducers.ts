import { createFeature, createReducer, on } from '@ngrx/store';
import { TagsStateModel } from '@home/data-access/models';
import { tagsActions } from './tags.actions';

const initialState: TagsStateModel = {
  tags: null,
  loading: false,
  error: null
};

const tagsFeature = createFeature({
  name: 'tags',
  reducer: createReducer(
    initialState,
    on(
      tagsActions.getTags,
      (state): TagsStateModel => ({
        ...state,
        loading: true
      })
    ),
    on(
      tagsActions.getTagsSuccess,
      (state, { tags }): TagsStateModel => ({
        ...state,
        tags: tags,
        loading: false,
        error: null
      })
    ),
    on(
      tagsActions.getTagsFailure,
      (state, { error }): TagsStateModel => ({
        ...state,
        loading: false,
        error: error
      })
    )
  )
});

export const {
  name: tagsFeatureKey,
  reducer: tagsReducer,
  selectTags,
  selectLoading,
  selectError
} = tagsFeature;
