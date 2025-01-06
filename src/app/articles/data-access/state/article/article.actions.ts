import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Article, Profile } from '@shared/data-access/models';

export const articleActions = createActionGroup({
  source: 'Article API',
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
