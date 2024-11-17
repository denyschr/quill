import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const tagsActions = createActionGroup({
  source: 'Tags API',
  events: {
    'Get Tags': emptyProps(),
    'Get Tags Success': props<{ tags: string[] }>(),
    'Get Tags Failure': emptyProps()
  }
});
