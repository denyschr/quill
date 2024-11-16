import { createFeature, createReducer, on } from '@ngrx/store';
import { tagsActions } from './tags.actions';

export interface TagsState {
  tags: string[] | null;
  loading: boolean;
  error: string | null;
}

export const initialState: TagsState = {
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
      (state): TagsState => ({
        ...state,
        loading: true
      })
    ),
    on(
      tagsActions.getTagsSuccess,
      (state, { tags }): TagsState => ({
        ...state,
        tags: tags,
        loading: false,
        error: null
      })
    ),
    on(
      tagsActions.getTagsFailure,
      (state, { error }): TagsState => ({
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
