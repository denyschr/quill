import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ArticleApiClient } from '../../api';
import { ArticleListResponse } from '../../models';

import { articleListActions } from './article-list.actions';
import * as articleListEffects from './article-list.effects';

describe('ArticleListEffects', () => {
  let mockArticleApiClient: jasmine.SpyObj<ArticleApiClient>;
  let store: MockStore;
  let actions$: Observable<unknown>;

  const mockArticles = {
    articles: [{ title: 'How to train your dragon' }, { title: 'How to train your dragon 2' }],
    articlesCount: 2
  } as ArticleListResponse;
  const mockArticle = mockArticles.articles[0];

  beforeEach(() => {
    mockArticleApiClient = jasmine.createSpyObj<ArticleApiClient>('ArticleApiClient', [
      'getAll',
      'favorite',
      'unfavorite'
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ArticleApiClient, useValue: mockArticleApiClient }
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
    it('should return a loadArticlesSuccess action with a list of articles on success', done => {
      actions$ = of(articleListActions.loadArticles);

      mockArticleApiClient.getAll.and.returnValue(of(mockArticles));

      articleListEffects.loadArticles$(actions$, store, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(
          articleListActions.loadArticlesSuccess({
            articles: mockArticles.articles,
            total: mockArticles.articlesCount
          })
        );
        done();
      });
    });

    it('should return a loadArticlesFailure action on failure', done => {
      actions$ = of(articleListActions.loadArticles);

      mockArticleApiClient.getAll.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.loadArticles$(actions$, store, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.getAll).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.loadArticlesFailure());
        done();
      });
    });
  });

  describe('favorite$', () => {
    it('should return a favoriteSuccess action with a favorited article on success', done => {
      actions$ = of(articleListActions.favorite);

      mockArticleApiClient.favorite.and.returnValue(of(mockArticle));

      articleListEffects.favorite$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.favorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.favoriteSuccess({ article: mockArticle }));
        done();
      });
    });

    it('should return a favoriteFailure action on failure', done => {
      actions$ = of(articleListActions.favorite);

      mockArticleApiClient.favorite.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.favorite$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.favorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.favoriteFailure());
        done();
      });
    });
  });

  describe('unfavorite$', () => {
    it('should return an unfavoriteSuccess action with an unfavorited article on success', done => {
      actions$ = of(articleListActions.unfavorite);

      mockArticleApiClient.unfavorite.and.returnValue(of(mockArticle));

      articleListEffects.unfavorite$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.unfavorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.unfavoriteSuccess({ article: mockArticle }));
        done();
      });
    });

    it('should return an unfavoriteFailure action on failure', done => {
      actions$ = of(articleListActions.unfavorite);

      mockArticleApiClient.unfavorite.and.returnValue(throwError(() => new Error('error')));

      articleListEffects.unfavorite$(actions$, mockArticleApiClient).subscribe(action => {
        expect(mockArticleApiClient.unfavorite).toHaveBeenCalled();
        expect(action).toEqual(articleListActions.unfavoriteFailure());
        done();
      });
    });
  });
});
