import { ArticleApiClient } from '@app/shared/data-access/api/services';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { articleListActions } from './article-list.actions';
import * as articleListEffects from './article-list.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArticleListResponse } from '@app/shared/data-access/api/models';

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
    it('should trigger a `loadArticles` action', done => {
      actions$ = of(articleListActions.setPage);
      articleListEffects.setPage$(actions$).subscribe(action => {
        expect(action).toEqual(articleListActions.loadArticles());
        done();
      });
    });
  });

  describe('setConfig$', () => {
    it('should trigger a `loadArticles` action', done => {
      actions$ = of(articleListActions.setConfig);
      articleListEffects.setConfig$(actions$).subscribe(action => {
        expect(action).toEqual(articleListActions.loadArticles());
        done();
      });
    });
  });

  describe('loadArticles$', () => {
    it('should return a `loadArticlesSuccess` action with a list of articles on success', done => {
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

    it('should return a `loadArticlesFailure` action on failure', done => {
      actions$ = of(articleListActions.loadArticles);

      articleClient.getAll.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.loadArticles$(actions$, store, articleClient).subscribe(action => {
        expect(articleClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.loadArticlesFailure());
        done();
      });
    });
  });

  describe('favorite$', () => {
    it('should return a `favoriteSuccess` action with a favorited article on success', done => {
      actions$ = of(articleListActions.favorite);

      articleClient.favorite.and.returnValue(of(articleList.articles[0]));

      articleListEffects.favorite$(actions$, articleClient).subscribe(action => {
        expect(articleClient.favorite).toHaveBeenCalled();
        expect(action).toEqual(
          articleListActions.favoriteSuccess({ article: articleList.articles[0] })
        );
        done();
      });
    });

    it('should return a `favoriteFailure` action on failure', done => {
      actions$ = of(articleListActions.favorite);

      articleClient.favorite.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.favorite$(actions$, articleClient).subscribe(action => {
        expect(articleClient.favorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.favoriteFailure());
        done();
      });
    });
  });

  describe('unfavorite$', () => {
    it('should return an `unfavoriteSuccess` action with an unfavorited article on success', done => {
      actions$ = of(articleListActions.unfavorite);

      articleClient.unfavorite.and.returnValue(of(articleList.articles[0]));

      articleListEffects.unfavorite$(actions$, articleClient).subscribe(action => {
        expect(articleClient.unfavorite).toHaveBeenCalled();
        expect(action).toEqual(
          articleListActions.unfavoriteSuccess({ article: articleList.articles[0] })
        );
        done();
      });
    });

    it('should return an `unfavoriteFailure` action on failure', done => {
      actions$ = of(articleListActions.unfavorite);

      articleClient.unfavorite.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.unfavorite$(actions$, articleClient).subscribe(action => {
        expect(articleClient.unfavorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.unfavoriteFailure());
        done();
      });
    });
  });
});
