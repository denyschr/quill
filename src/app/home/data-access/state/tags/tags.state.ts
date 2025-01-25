import { createFeature, createReducer, on } from '@ngrx/store';
import { tagsActions } from './tags.actions';

export interface TagsState {
  tags: string[];
  loading: boolean;
}

export const tagsInitialState: TagsState = {
  tags: [],
  loading: false
};

const tagsFeature = createFeature({
  name: 'tags',
  reducer: createReducer(
    tagsInitialState,
    on(
      tagsActions.loadTags,
      (state): TagsState => ({
        ...state,
        loading: true
      })
    ),
    on(
      tagsActions.loadTagsSuccess,
      (state, { tags }): TagsState => ({
        ...state,
        tags: tags,
        loading: false
      })
    ),
    on(
      tagsActions.loadTagsFailure,
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
