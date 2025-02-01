import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleDetailActions } from './article-detail.actions';
import * as articleEffects from './article-detail.effects';
import { provideRouter, Router } from '@angular/router';
import { ArticleApiClient } from '@app/articles/data-access/services';
import { ProfileApiClient } from '@app/profile/data-access/services';
import { getMockedArticle, getMockedProfile } from '@app/testing.spec';

describe('ArticleDetailEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let profileClient: jasmine.SpyObj<ProfileApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['get', 'delete']);
    profileClient = jasmine.createSpyObj<ProfileApiClient>('ProfileApiClient', [
      'follow',
      'unfollow'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: articleClient },
        { provide: ProfileApiClient, useValue: profileClient }
      ]
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  describe('loadArticle$', () => {
    it('should return a loadArticleSuccess action with an article on success', done => {
      const article = getMockedArticle();
      actions$ = of(articleDetailActions.loadArticle);

      articleClient.get.and.returnValue(of(article));

      articleEffects.loadArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.get).toHaveBeenCalled();
        expect(action).toEqual(
          articleDetailActions.loadArticleSuccess({
            article
          })
        );
        done();
      });
    });

    it('should return a loadArticleFailure action on failure', done => {
      actions$ = of(articleDetailActions.loadArticle);

      articleClient.get.and.returnValue(throwError(() => new Error('error')));

      articleEffects.loadArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.get).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.loadArticleFailure());
        done();
      });
    });
  });

  describe('loadArticleFailure$', () => {
    it('should navigate to the home page', done => {
      actions$ = of(articleDetailActions.loadArticleFailure);

      TestBed.runInInjectionContext(() => {
        articleEffects.loadArticleFailure$(actions$, router).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('follow$', () => {
    it('should return a followSuccess action with a profile on success', done => {
      const profile = getMockedProfile({ following: true });
      actions$ = of(articleDetailActions.follow);

      profileClient.follow.and.returnValue(of(profile));

      articleEffects.follow$(actions$, profileClient).subscribe(action => {
        expect(profileClient.follow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.followSuccess({ profile }));
        done();
      });
    });

    it('should return a followFailure action on failure', done => {
      actions$ = of(articleDetailActions.follow);

      profileClient.follow.and.returnValue(throwError(() => new Error('error')));

      articleEffects.follow$(actions$, profileClient).subscribe(action => {
        expect(profileClient.follow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.followFailure());
        done();
      });
    });
  });

  describe('unfollow$', () => {
    it('should return an unfollowSuccess action with a profile on success', done => {
      const profile = getMockedProfile({ following: false });
      actions$ = of(articleDetailActions.unfollow);

      profileClient.unfollow.and.returnValue(of(profile));

      articleEffects.unfollow$(actions$, profileClient).subscribe(action => {
        expect(profileClient.unfollow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.unfollowSuccess({ profile }));
        done();
      });
    });

    it('should return an unfollowFailure action on failure', done => {
      actions$ = of(articleDetailActions.unfollow);

      profileClient.unfollow.and.returnValue(throwError(() => new Error('error')));

      articleEffects.unfollow$(actions$, profileClient).subscribe(action => {
        expect(profileClient.unfollow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.unfollowFailure());
        done();
      });
    });
  });

  describe('deleteArticle$', () => {
    it('should return a deleteArticleSuccess action on success', done => {
      actions$ = of(articleDetailActions.deleteArticle);

      articleClient.delete.and.returnValue(of(void 0));

      articleEffects.deleteArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.delete).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.deleteArticleSuccess());
        done();
      });
    });

    it('should return a deleteArticleFailure action on failure', done => {
      actions$ = of(articleDetailActions.deleteArticle);

      articleClient.delete.and.returnValue(throwError(() => new Error('error')));

      articleEffects.deleteArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.delete).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.deleteArticleFailure());
        done();
      });
    });
  });

  describe('deleteArticleSuccess$', () => {
    it('should navigate to the home page', done => {
      actions$ = of(articleDetailActions.deleteArticleSuccess);

      TestBed.runInInjectionContext(() => {
        articleEffects.deleteArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
