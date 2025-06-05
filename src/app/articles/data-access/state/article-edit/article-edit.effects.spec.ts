import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { ArticleApiClient } from '../../api';
import { Article } from '../../models';

import { articleEditActions } from './article-edit.actions';
import * as articleEditEffects from './article-edit.effects';

describe('ArticleEditEffects', () => {
  let mockArticleApiClient: jasmine.SpyObj<ArticleApiClient>;
  let actions$: Observable<unknown>;

  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon'
  } as Article;

  beforeEach(() => {
    mockArticleApiClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['update']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: mockArticleApiClient }
      ]
    });
  });

  describe('editArticle$', () => {
    it('should return an editArticleSuccess action with an edited article on success', done => {
      actions$ = of(articleEditActions.editArticle);

      mockArticleApiClient.update.and.returnValue(of(mockArticle));

      articleEditEffects.editArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.update).toHaveBeenCalled();
        expect(action).toEqual(
          articleEditActions.editArticleSuccess({
            article: mockArticle
          })
        );
        done();
      });
    });

    it('should return an editArticleFailure action with a list of errors on failure', done => {
      const mockErrors = {
        title: ['is a required field'],
        body: ['is a required field']
      };
      actions$ = of(articleEditActions.editArticle);

      mockArticleApiClient.update.and.returnValue(throwError(() => ({ errors: mockErrors })));

      articleEditEffects.editArticle$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.update).toHaveBeenCalled();
        expect(action).toEqual(articleEditActions.editArticleFailure({ errors: mockErrors }));
        done();
      });
    });
  });

  describe('editArticleSuccess$', () => {
    it('should navigate to the edited article', done => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$ = of(articleEditActions.editArticleSuccess({ article: mockArticle }));

      TestBed.runInInjectionContext(() => {
        articleEditEffects.editArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/article', mockArticle.slug]);
          done();
        });
      });
    });
  });
});
