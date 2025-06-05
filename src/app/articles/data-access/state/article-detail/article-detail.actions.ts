import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Profile } from '@/app/profile/data-access/models';

import { Article } from '../../models';

export const articleDetailActions = createActionGroup({
  source: 'Article Detail',
  events: {
    loadArticle: props<{ slug: string }>(),
    loadArticleSuccess: props<{ article: Article }>(),
    loadArticleFailure: emptyProps(),

    follow: props<{ username: string }>(),
    followSuccess: props<{ profile: Profile }>(),
    followFailure: emptyProps(),

    unfollow: props<{ username: string }>(),
    unfollowSuccess: props<{ profile: Profile }>(),
    unfollowFailure: emptyProps(),

    deleteArticle: props<{ slug: string }>(),
    deleteArticleSuccess: emptyProps(),
    deleteArticleFailure: emptyProps()
  }
});
