import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article } from '@shared/data-access/models';

export const articleActions = createActionGroup({
  source: 'Article API',
  events: {
    'Get Article': props<{ slug: string }>(),
    'Get Article Success': props<{ article: Article }>(),
    'Get Article Failure': props<{ error: string }>(),

    'Delete Article': props<{ slug: string }>(),
    'Delete Article Success': emptyProps(),
    'Delete Article Failure': props<{ error: string }>()
  }
});
