import { ArticleApiClient } from '@shared/data-access/api';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleListActions } from './article-list.actions';
import * as articleListEffects from './article-list.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArticleListResponse } from '@shared/data-access/models';

describe('ArticleListEffects', () => {
  let articleClient: jasmine.SpyObj<ArticleApiClient>;
  let store: MockStore;
  let actions$: Observable<unknown>;

  const articleList = {
    articles: [{ title: 'title one' }, { title: 'title two' }],
    articlesCount: 2
  } as ArticleListResponse;

  beforeEach(() => {
    articleClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', [
      'getAll',
      'favorite',
      'unfavorite'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ArticleApiClient, useValue: articleClient }
      ]
    });

    store = TestBed.inject(MockStore);
  });

  describe('setPage$', () => {
    it('should trigger a loadArticles action', done => {
      actions$ = of(articleListActions.setPage);
      articleListEffects.setPage$(actions$).subscribe(action => {
        expect(action).toEqual(articleListActions.loadArticles());
        done();
      });
    });
  });

  describe('setConfig$', () => {
    it('should trigger a loadArticles action', done => {
      actions$ = of(articleListActions.setConfig);
      articleListEffects.setConfig$(actions$).subscribe(action => {
        expect(action).toEqual(articleListActions.loadArticles());
        done();
      });
    });
  });

  describe('loadArticles$', () => {
    it('should return a loadArticlesSuccess action with a list of articles if success', done => {
      actions$ = of(articleListActions.loadArticles);

      articleClient.getAll.and.returnValue(of(articleList));

      articleListEffects.loadArticles$(actions$, store, articleClient).subscribe(action => {
        expect(articleClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(
          articleListActions.loadArticlesSuccess({
            articles: articleList.articles,
            total: articleList.articlesCount
          })
        );
        done();
      });
    });

    it('should return a loadArticlesFailure action if failed', done => {
      actions$ = of(articleListActions.loadArticles);

      articleClient.getAll.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.loadArticles$(actions$, store, articleClient).subscribe(action => {
        expect(articleClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.loadArticlesFailure());
        done();
      });
    });
  });
});
