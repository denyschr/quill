import { ArticleApiClient } from '@shared/data-access/api/services';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleNewActions } from './article-new.actions';
import { Article } from '@shared/data-access/api/models';
import * as articleNewEffects from './article-new.effects';

describe('ArticleNewEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  const article = { slug: 'title-one', title: 'title one' } as Article;

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['create']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: ArticleApiClient, useValue: articleClient }
      ]
    });

    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  describe('newArticle$', () => {
    it('should return an `newArticleSuccess` action with a created article on success', done => {
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

    it('should return an `newArticleFailure` action with errors on failure', done => {
      const errors = { title: ['is missing'], body: ['is required'] };
      actions$ = of(articleNewActions.newArticle);

      articleClient.create.and.returnValue(throwError(() => ({ error: { errors } })));

      articleNewEffects.newArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.create).toHaveBeenCalled();
        expect(action).toEqual(articleNewActions.newArticleFailure({ errors }));
        done();
      });
    });
  });

  describe('newArticleSuccess$', () => {
    it('should navigate to a created article on article new success', done => {
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
