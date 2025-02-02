import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleEditActions } from './article-edit.actions';
import * as articleEditEffects from './article-edit.effects';
import { ArticleApiClient } from '@app/articles/data-access/services';
import { getMockedArticle } from '@app/testing.spec';
import { BackendErrors } from '@app/core/data-access/models';

describe('ArticleEditEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let actions$: Observable<unknown>;

  const article = getMockedArticle();

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['update']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: articleClient }
      ]
    });
  });

  describe('editArticle$', () => {
    it('should return an editArticleSuccess action with an edited article on success', done => {
      actions$ = of(articleEditActions.editArticle);

      articleClient.update.and.returnValue(of(article));

      articleEditEffects.editArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.update).toHaveBeenCalled();
        expect(action).toEqual(
          articleEditActions.editArticleSuccess({
            article
          })
        );
        done();
      });
    });

    it('should return an editArticleFailure action with a list of errors on failure', done => {
      const errors: BackendErrors = {
        title: ['is a required field'],
        body: ['is a required field']
      };
      actions$ = of(articleEditActions.editArticle);

      articleClient.update.and.returnValue(throwError(() => ({ errors })));

      articleEditEffects.editArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.update).toHaveBeenCalled();
        expect(action).toEqual(articleEditActions.editArticleFailure({ errors }));
        done();
      });
    });
  });

  describe('editArticleSuccess$', () => {
    it('should navigate to the edited article', done => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      actions$ = of(articleEditActions.editArticleSuccess({ article }));

      TestBed.runInInjectionContext(() => {
        articleEditEffects.editArticleSuccess$(actions$, router).subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/article', article.slug]);
          done();
        });
      });
    });
  });
});
