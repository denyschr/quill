import { ArticleApiClient } from '@shared/data-access/api';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleEditActions } from './article-edit.actions';
import { Article } from '@shared/data-access/models';
import * as articleEditEffects from './article-edit.effects';

describe('ArticleEditEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  const article = { slug: 'title-one', title: 'title one' } as Article;

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', ['update']);

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

  describe('editArticle$', () => {
    it('should return an `editArticleSuccess` action with an updated article on success', done => {
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

    it('should return an `editArticleFailure` action with errors on failure', done => {
      const errors = { title: ['is missing'], body: ['is required'] };
      actions$ = of(articleEditActions.editArticle);

      articleClient.update.and.returnValue(throwError(() => ({ error: { errors } })));

      articleEditEffects.editArticle$(actions$, articleClient).subscribe(action => {
        expect(articleClient.update).toHaveBeenCalled();
        expect(action).toEqual(articleEditActions.editArticleFailure({ errors }));
        done();
      });
    });
  });

  describe('editArticleSuccess$', () => {
    it('should navigate to an updated article on article editing success', done => {
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
