import { TestBed } from '@angular/core/testing';
import { ArticleApiClient } from './article-api-client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArticleListResponseModel } from '@shared/data-access/models';

describe('ArticleApiClient', () => {
  let articleApiClient: ArticleApiClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    articleApiClient = TestBed.inject(ArticleApiClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(articleApiClient).toBeTruthy();
  });

  it('should get a list of articles', () => {
    const hardcodedArticles = {
      articles: [
        {
          title: 'How to train your dragon'
        },
        {
          title: 'How to train your dragon 2'
        }
      ],
      articlesCount: 2
    } as ArticleListResponseModel;

    let actualArticles: ArticleListResponseModel | undefined;
    articleApiClient
      .getAll({ type: 'all', filters: {} })
      .subscribe(articleList => (actualArticles = articleList));

    http.expectOne({ method: 'GET', url: '/articles' }).flush(hardcodedArticles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toBe(hardcodedArticles);
  });
});
