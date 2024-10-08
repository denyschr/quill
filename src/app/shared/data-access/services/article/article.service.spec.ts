import { TestBed } from '@angular/core/testing';
import { ArticleService } from './article.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArticleListResponseModel } from '@shared/data-access/models';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    articleService = TestBed.inject(ArticleService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(articleService).toBeTruthy();
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
    articleService
      .getAll({ type: 'all', filters: {} })
      .subscribe(articleList => (actualArticles = articleList));

    http.expectOne({ method: 'GET', url: '/articles' }).flush(hardcodedArticles);

    expect(actualArticles)
      .withContext('The observable should emit the list of articles')
      .toBe(hardcodedArticles);
  });
});
