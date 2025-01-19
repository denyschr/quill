import { TestBed } from '@angular/core/testing';
import { ArticleApiClient } from './article-api-client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Article, ArticleListConfig, ArticleListResponse } from '@shared/data-access/api/models';
import { getMockedArticle } from '../../../../testing.spec';

describe('ArticleApiClient', () => {
  let articleClient: ArticleApiClient;
  let httpController: HttpTestingController;

  const articles: ArticleListResponse = {
    articles: [
      getMockedArticle({ article: { favorited: true }, profile: { username: 'diamond' } }),
      getMockedArticle({ profile: { username: 'john' } })
    ],
    articlesCount: 2
  };
  const article = getMockedArticle();
  const slug = article.slug;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    articleClient = TestBed.inject(ArticleApiClient);
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
    articleClient.getAll(config).subscribe(fetchedArticles => (actualArticles = fetchedArticles));

    httpController
      .expectOne(`/articles?tag=${config.filters.tag}&limit=${config.filters.limit}`)
      .flush(articles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toEqual(articles);
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
    articleClient.getAll(config).subscribe(fetchedArticles => (actualArticles = fetchedArticles));

    httpController
      .expectOne(`/articles/feed?author=${config.filters.author}&offset=${config.filters.offset}`)
      .flush(articles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toEqual(articles);
  });

  it('should return an article', () => {
    let actualArticle: Article | undefined;
    articleClient.get(slug).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    httpController.expectOne(`/articles/${slug}`).flush({ article });

    expect(actualArticle).withContext('The observable should emit the article').toBe(article);
  });

  it('should create an article', () => {
    const newArticle = {
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList
    };

    let actualArticle: Article | undefined;
    articleClient.create(newArticle).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'POST', url: '/articles' });
    expect(req.request.body).toEqual({ article: newArticle });
    req.flush({ article });

    expect(actualArticle).withContext('The observable should emit the article').toBe(article);
  });

  it('should update an article', () => {
    const updatedArticle = {
      ...article,
      body: 'You have to believe'
    };

    let actualArticle: Article | undefined;
    articleClient
      .update(slug, { body: updatedArticle.body })
      .subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'PUT', url: `/articles/${slug}` });
    expect(req.request.body).toEqual({ article: { body: updatedArticle.body } });
    req.flush({ article: updatedArticle });

    expect(actualArticle)
      .withContext('The observable should emit the article')
      .toBe(updatedArticle);
  });

  it('should delete an article', () => {
    let called = false;
    articleClient.delete(slug).subscribe(() => (called = true));

    httpController.expectOne({ method: 'DELETE', url: `/articles/${slug}` }).flush(null);

    expect(called).toBe(true);
  });

  it('should favorite an article', () => {
    let actualArticle: Article | undefined;
    articleClient.favorite(slug).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'POST', url: `/articles/${slug}/favorite` });
    expect(req.request.body).toBeNull();
    req.flush({ article });

    expect(actualArticle).withContext('The observable should emit the article').toEqual(article);
  });

  it('should unfavorite an article', () => {
    let actualArticle: Article | undefined;
    articleClient.unfavorite(slug).subscribe(article => (actualArticle = article));

    httpController
      .expectOne({ method: 'DELETE', url: `/articles/${slug}/favorite` })
      .flush({ article });

    expect(actualArticle).withContext('The observable should emit the article').toEqual(article);
  });
});
