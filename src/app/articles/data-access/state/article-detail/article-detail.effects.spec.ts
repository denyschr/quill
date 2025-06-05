import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Router } from '@angular/router';

import { ProfileApiClient } from '@/app/profile/data-access/api';
import { Profile } from '@/app/profile/data-access/models';

import { ArticleApiClient } from '../../api';
import { Article } from '../../models';

import { articleDetailActions } from './article-detail.actions';
import * as articleEffects from './article-detail.effects';

describe('ArticleDetailEffects', () => {
  let mockArticleApiClient: jasmine.SpyObj<ArticleApiClient>;
  let mockProfileApiClient: jasmine.SpyObj<ProfileApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  const mockProfile = { username: 'jack' } as Profile;

  beforeEach(() => {
    mockArticleApiClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', [
      'get',
      'delete'
    ]);
    mockProfileApiClient = jasmine.createSpyObj<ProfileApiClient>('ProfileApiClient', [
      'follow',
      'unfollow'
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: mockArticleApiClient },
        { provide: ProfileApiClient, useValue: mockProfileApiClient }
      ]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  describe('loadArticle$', () => {
    it('should return a loadArticleSuccess action with an article on success', done => {
      const mockArticle = { title: 'How to train your dragon' } as Article;
      actions$ = of(articleDetailActions.loadArticle);

      mockArticleApiClient.get.and.returnValue(of(mockArticle));

      articleEffects.loadArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.get).toHaveBeenCalled();
        expect(action).toEqual(
          articleDetailActions.loadArticleSuccess({
            article: mockArticle
          })
        );
        done();
      });
    });

    it('should return a loadArticleFailure action on failure', done => {
      actions$ = of(articleDetailActions.loadArticle);

      mockArticleApiClient.get.and.returnValue(throwError(() => new Error('error')));

      articleEffects.loadArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.get).toHaveBeenCalled();
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
      actions$ = of(articleDetailActions.follow);

      mockProfileApiClient.follow.and.returnValue(of(mockProfile));

      articleEffects.follow$(actions$, mockProfileApiClient).subscribe(action => {
        expect(mockProfileApiClient.follow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.followSuccess({ profile: mockProfile }));
        done();
      });
    });

    it('should return a followFailure action on failure', done => {
      actions$ = of(articleDetailActions.follow);

      mockProfileApiClient.follow.and.returnValue(throwError(() => new Error('error')));

      articleEffects.follow$(actions$, mockProfileApiClient).subscribe(action => {
        expect(mockProfileApiClient.follow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.followFailure());
        done();
      });
    });
  });

  describe('unfollow$', () => {
    it('should return an unfollowSuccess action with a profile on success', done => {
      actions$ = of(articleDetailActions.unfollow);

      mockProfileApiClient.unfollow.and.returnValue(of(mockProfile));

      articleEffects.unfollow$(actions$, mockProfileApiClient).subscribe(action => {
        expect(mockProfileApiClient.unfollow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.unfollowSuccess({ profile: mockProfile }));
        done();
      });
    });

    it('should return an unfollowFailure action on failure', done => {
      actions$ = of(articleDetailActions.unfollow);

      mockProfileApiClient.unfollow.and.returnValue(throwError(() => new Error('error')));

      articleEffects.unfollow$(actions$, mockProfileApiClient).subscribe(action => {
        expect(mockProfileApiClient.unfollow).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.unfollowFailure());
        done();
      });
    });
  });

  describe('deleteArticle$', () => {
    it('should return a deleteArticleSuccess action on success', done => {
      actions$ = of(articleDetailActions.deleteArticle);

      mockArticleApiClient.delete.and.returnValue(of(undefined));

      articleEffects.deleteArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.delete).toHaveBeenCalled();
        expect(action).toEqual(articleDetailActions.deleteArticleSuccess());
        done();
      });
    });

    it('should return a deleteArticleFailure action on failure', done => {
      actions$ = of(articleDetailActions.deleteArticle);

      mockArticleApiClient.delete.and.returnValue(throwError(() => new Error('error')));

      articleEffects.deleteArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.delete).toHaveBeenCalled();
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
