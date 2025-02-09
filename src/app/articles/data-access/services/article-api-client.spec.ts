import { TestBed } from '@angular/core/testing';
import { ArticleApiClient } from './article-api-client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Article, ArticleListConfig, ArticleListResponse } from '@app/articles/data-access/models';

describe('ArticleApiClient', () => {
  let httpController: HttpTestingController;
  let articleApiClient: ArticleApiClient;

  const mockArticles = {
    articles: [
      { slug: 'how-to-train-your-dragon', title: 'How to train your dragon' },
      { slug: 'how-to-train-your-dragon-2', title: 'How to train your dragon 2' }
    ],
    articlesCount: 2
  } as ArticleListResponse;
  const mockArticle = mockArticles.articles[0];
  const mockSlug = mockArticle.slug;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    articleApiClient = TestBed.inject(ArticleApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should return a list of articles from the global feed', () => {
    const config: ArticleListConfig = {
      type: 'global',
      currentPage: 1,
      filters: {
        tag: 'dragons',
        limit: 10
      }
    };

    let actualArticles: ArticleListResponse | undefined;
    articleApiClient
      .getAll(config)
      .subscribe(fetchedArticles => (actualArticles = fetchedArticles));

    httpController
      .expectOne(`/articles?tag=${config.filters.tag}&limit=${config.filters.limit}`)
      .flush(mockArticles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toEqual(mockArticles);
  });

  it('should return a list of articles from the user feed', () => {
    const config: ArticleListConfig = {
      type: 'feed',
      currentPage: 2,
      filters: {
        author: 'jake',
        offset: 0
      }
    };

    let actualArticles: ArticleListResponse | undefined;
    articleApiClient
      .getAll(config)
      .subscribe(fetchedArticles => (actualArticles = fetchedArticles));

    httpController
      .expectOne(`/articles/feed?author=${config.filters.author}&offset=${config.filters.offset}`)
      .flush(mockArticles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toEqual(mockArticles);
  });

  it('should return an article', () => {
    let actualArticle: Article | undefined;
    articleApiClient.get(mockSlug).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    httpController.expectOne(`/articles/${mockSlug}`).flush({ article: mockArticle });

    expect(actualArticle).withContext('The observable should emit the article').toBe(mockArticle);
  });

  it('should create an article', () => {
    let actualArticle: Article | undefined;
    articleApiClient
      .create(mockArticle)
      .subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'POST', url: '/articles' });
    expect(req.request.body).toEqual({ article: mockArticle });
    req.flush({ article: mockArticle });

    expect(actualArticle).withContext('The observable should emit the article').toBe(mockArticle);
  });

  it('should update an article', () => {
    let actualArticle: Article | undefined;
    articleApiClient
      .update(mockSlug, { title: mockArticle.title })
      .subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'PUT', url: `/articles/${mockSlug}` });
    expect(req.request.body).toEqual({ article: { title: mockArticle.title } });
    req.flush({ article: mockArticle });

    expect(actualArticle).withContext('The observable should emit the article').toBe(mockArticle);
  });

  it('should delete an article', () => {
    let called = false;
    articleApiClient.delete(mockSlug).subscribe(() => (called = true));

    httpController.expectOne({ method: 'DELETE', url: `/articles/${mockSlug}` }).flush(null);

    expect(called).toBe(true);
  });

  it('should favorite an article', () => {
    let actualArticle: Article | undefined;
    articleApiClient
      .favorite(mockSlug)
      .subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'POST', url: `/articles/${mockSlug}/favorite` });
    expect(req.request.body).toBeNull();
    req.flush({ article: mockArticle });

    expect(actualArticle)
      .withContext('The observable should emit the article')
      .toEqual(mockArticle);
  });

  it('should unfavorite an article', () => {
    let actualArticle: Article | undefined;
    articleApiClient.unfavorite(mockSlug).subscribe(article => (actualArticle = article));

    httpController
      .expectOne({ method: 'DELETE', url: `/articles/${mockSlug}/favorite` })
      .flush({ article: mockArticle });

    expect(actualArticle)
      .withContext('The observable should emit the article')
      .toEqual(mockArticle);
  });
});
