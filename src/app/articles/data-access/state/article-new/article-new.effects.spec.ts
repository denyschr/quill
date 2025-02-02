import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleNewActions } from './article-new.actions';
import * as articleNewEffects from './article-new.effects';
import { ArticleApiClient } from '@app/articles/data-access/services';
import { getMockedArticle } from '@app/testing.spec';
import { BackendErrors } from '@app/core/data-access/models';

describe('ArticleNewEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let actions$: Observable<unknown>;

  const article = getMockedArticle();

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['create']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: articleClient }
      ]
    });
  });

  describe('newArticle$', () => {
    it('should return an newArticleSuccess action with a created article on success', done => {
      actions$ = of(articleNewActions.newArticle);

      articleClient.create.and.returnValue(of(article));

      articleNewEffects.newArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.create).toHaveBeenCalled();
        expect(action).toEqual(
          articleNewActions.newArticleSuccess({
            article
          })
        );
        done();
      });
    });

    it('should return an newArticleFailure action with a list of errors on failure', done => {
      const errors: BackendErrors = {
        title: ['is a required field'],
        body: ['is a required field']
      };
      actions$ = of(articleNewActions.newArticle);

      articleClient.create.and.returnValue(throwError(() => ({ errors })));

      articleNewEffects.newArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.create).toHaveBeenCalled();
        expect(action).toEqual(articleNewActions.newArticleFailure({ errors }));
        done();
      });
    });
  });

  describe('newArticleSuccess$', () => {
    it('should navigate to the created article', done => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$ = of(articleNewActions.newArticleSuccess({ article }));

      TestBed.runInInjectionContext(() => {
        articleNewEffects.newArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/article', article.slug]);
          done();
        });
      });
    });
  });
});
