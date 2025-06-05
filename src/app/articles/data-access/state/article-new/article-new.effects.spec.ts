import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { ArticleApiClient } from '../../api';
import { Article } from '../../models';

import { articleNewActions } from './article-new.actions';
import * as articleNewEffects from './article-new.effects';

describe('ArticleNewEffects', () => {
  let mockArticleApiClient: jasmine.SpyObj<ArticleApiClient>;
  let actions$: Observable<unknown>;

  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon'
  } as Article;

  beforeEach(() => {
    mockArticleApiClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['create']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: mockArticleApiClient }
      ]
    });
  });

  describe('newArticle$', () => {
    it('should return an newArticleSuccess action with a created article on success', done => {
      actions$ = of(articleNewActions.newArticle);

      mockArticleApiClient.create.and.returnValue(of(mockArticle));

      articleNewEffects.newArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.create).toHaveBeenCalled();
        expect(action).toEqual(
          articleNewActions.newArticleSuccess({
            article: mockArticle
          })
        );
        done();
      });
    });

    it('should return an newArticleFailure action with a list of errors on failure', done => {
      const mockErrors = {
        title: ['is a required field'],
        body: ['is a required field']
      };
      actions$ = of(articleNewActions.newArticle);

      mockArticleApiClient.create.and.returnValue(throwError(() => ({ errors: mockErrors })));

      articleNewEffects.newArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.create).toHaveBeenCalled();
        expect(action).toEqual(articleNewActions.newArticleFailure({ errors: mockErrors }));
        done();
      });
    });
  });

  describe('newArticleSuccess$', () => {
    it('should navigate to the created article', done => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$ = of(articleNewActions.newArticleSuccess({ article: mockArticle }));

      TestBed.runInInjectionContext(() => {
        articleNewEffects.newArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/article', mockArticle.slug]);
          done();
        });
      });
    });
  });
});
