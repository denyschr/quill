import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const popularTagsActions = createActionGroup({
  source: 'Popular Tags API',
  events: {
    'Get Popular Tags': emptyProps(),
    'Get Popular Tags Success': props<{ tags: string[] }>(),
    'Get Popular Tags Failure': props<{ error: string }>()
  }
});
