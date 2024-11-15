import { TestBed } from '@angular/core/testing';
import { ArticleApiClient } from './article-api-client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArticleListResponseModel, ArticleModel } from '@shared/data-access/models';

describe('ArticleApiClient', () => {
  let articleApiClient: ArticleApiClient;
  let httpController: HttpTestingController;

  const article = { title: 'title' } as ArticleModel;
  const slug = 'slug';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    articleApiClient = TestBed.inject(ArticleApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    expect(articleApiClient).toBeTruthy();
  });

  it('should return a list of articles', () => {
    const expectedArticles = {
      articles: [{ title: 'title one' }, { title: 'title two' }],
      articlesCount: 2
    } as ArticleListResponseModel;
    const filters = {
      tag: 'tag',
      author: 'author'
    };

    let actualArticles: ArticleListResponseModel | undefined;
    articleApiClient
      .getAll({ type: 'feed', filters })
      .subscribe(articles => (actualArticles = articles));

    httpController
      .expectOne(`/articles/feed?tag=${filters.tag}&author=${filters.author}`)
      .flush(expectedArticles);

    expect(actualArticles)
      .withContext(
        'The `getAll` method should return an ArticleListResponseModel wrapped in an Observable'
      )
      .toEqual(expectedArticles);
  });

  it('should return an article', () => {
    let actualArticle: ArticleModel | undefined;
    articleApiClient.get(slug).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    httpController.expectOne(`/articles/${slug}`).flush({ article });

    expect(actualArticle)
      .withContext('The `get` method should return an ArticleModel wrapped in an Observable')
      .toBe(article);
  });

  it('should create an article', () => {
    let actualArticle: ArticleModel | undefined;
    articleApiClient.create(article).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'POST', url: '/articles' });
    expect(req.request.body).toEqual({ article });
    req.flush({ article });

    expect(actualArticle)
      .withContext('The `create` method should return an ArticleModel wrapped in an Observable')
      .toBe(article);
  });

  it('should update an article', () => {
    let actualArticle: ArticleModel | undefined;
    articleApiClient
      .update(slug, article)
      .subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    const req = httpController.expectOne({ method: 'PUT', url: `/articles/${slug}` });
    expect(req.request.body).toEqual({ article });
    req.flush({ article });

    expect(actualArticle)
      .withContext('The `update` method should return an ArticleModel wrapped in an Observable')
      .toBe(article);
  });

  it('should delete an article', () => {
    let called = false;
    articleApiClient.delete(slug).subscribe(() => (called = true));

    httpController.expectOne({ method: 'DELETE', url: `/articles/${slug}` }).flush(null);

    expect(called).toBe(true);
  });

  it('should favorite an article', () => {
    let actualArticle: ArticleModel | undefined;
    articleApiClient.favorite(slug).subscribe(fetchedArticle => (actualArticle = fetchedArticle));

    httpController
      .expectOne({ method: 'POST', url: `/articles/${slug}/favorite` })
      .flush({ article });

    expect(actualArticle)
      .withContext('The `favorite` method should return an ArticleModel wrapped in an Observable')
      .toEqual(article);
  });

  it('should unfavorite an article', () => {
    let actualArticle: ArticleModel | undefined;
    articleApiClient.unfavorite(slug).subscribe(article => (actualArticle = article));

    httpController
      .expectOne({ method: 'DELETE', url: `/articles/${slug}/favorite` })
      .flush({ article });

    expect(actualArticle)
      .withContext('The `unfavorite` method should return an ArticleModel wrapped in an Observable')
      .toEqual(article);
  });
});
