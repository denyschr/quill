import { ArticleApiClient } from '@shared/data-access/api';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleActions } from './article.actions';
import { Article } from '@shared/data-access/models';
import * as articleEffects from './article.effects';
import { provideRouter, Router } from '@angular/router';

describe('ArticleEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['get', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: articleClient }
      ]
    });

    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
  });

  describe('loadArticle$', () => {
    it('should return a `loadArticleSuccess` action with an article on success', done => {
      const article = { title: 'title one' } as Article;
      actions$ = of(articleActions.loadArticle);

      articleClient.get.and.returnValue(of(article));

      articleEffects.loadArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.get).toHaveBeenCalled();
        expect(action).toEqual(
          articleActions.loadArticleSuccess({
            article
          })
        );
        done();
      });
    });

    it('should return a `loadArticleFailure` action on failure', done => {
      actions$ = of(articleActions.loadArticle);

      articleClient.get.and.returnValue(throwError(() => new Error('error')));

      articleEffects.loadArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.get).toHaveBeenCalled();
        expect(action).toEqual(articleActions.loadArticleFailure());
        done();
      });
    });
  });

  describe('loadArticleFailure$', () => {
    it('should navigate to the home page on article loading failure', done => {
      actions$ = of(articleActions.loadArticleFailure);

      TestBed.runInInjectionContext(() => {
        articleEffects.loadArticleFailure$(actions$, router).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('deleteArticle$', () => {
    it('should return a `deleteArticleSuccess` action on success', done => {
      actions$ = of(articleActions.deleteArticle);

      articleClient.delete.and.returnValue(of(void 0));

      articleEffects.deleteArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.delete).toHaveBeenCalled();
        expect(action).toEqual(articleActions.deleteArticleSuccess());
        done();
      });
    });

    it('should return a `deleteArticleFailure` action on failure', done => {
      actions$ = of(articleActions.deleteArticle);

      articleClient.delete.and.returnValue(throwError(() => new Error('error')));

      articleEffects.deleteArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.delete).toHaveBeenCalled();
        expect(action).toEqual(articleActions.deleteArticleFailure());
        done();
      });
    });
  });

  describe('deleteArticleSuccess$', () => {
    it('should navigate to the home page on article deleting success', done => {
      actions$ = of(articleActions.deleteArticleSuccess);

      TestBed.runInInjectionContext(() => {
        articleEffects.deleteArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
