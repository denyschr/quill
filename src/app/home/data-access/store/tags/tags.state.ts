import { createFeature, createReducer, on } from '@ngrx/store';
import { tagsActions } from './tags.actions';

export interface TagsState {
  tags: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: TagsState = {
  tags: [],
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
        loading: false
      })
    ),
    on(
      tagsActions.getTagsFailure,
      (state): TagsState => ({
        ...state,
        loading: false
      })
    )
  )
});

export const {
  name: tagsFeatureKey,
  reducer: tagsReducer,
  selectTags,
  selectLoading
} = tagsFeature;
