import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const tagsActions = createActionGroup({
  source: 'Tags',
  events: {
    loadTags: emptyProps(),
    loadTagsSuccess: props<{ tags: string[] }>(),
    loadTagsFailure: emptyProps()
  }
});
