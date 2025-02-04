/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ArticlePreviewComponent } from '@app/articles/ui/article-preview';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  articleListActions,
  articleListInitialState
} from '@app/articles/data-access/state/article-list';
import { Article, ArticleListResponse } from '@app/articles/data-access/models';
import { getMockedArticle } from '@app/testing.spec';

@Component({
  selector: 'ql-article-preview',
  template: '',
  standalone: true
})
class ArticlePreviewStubComponent {
  @Input({ required: true })
  public article!: Article;

  @Output()
  public readonly favorited = new EventEmitter<string>();

  @Output()
  public readonly unfavorited = new EventEmitter<string>();
}

describe('ArticleListComponent', () => {
  let store: MockStore;
  const initialState = {
    articleList: articleListInitialState
  };

  const mockArticleList: ArticleListResponse = {
    articles: [
      getMockedArticle({ article: { slug: 'article-one' } }),
      getMockedArticle({ article: { slug: 'article-two' } })
    ],
    articlesCount: 12
  };

  beforeEach(() => {
    TestBed.overrideComponent(ArticleListComponent, {
      remove: { imports: [ArticlePreviewComponent] },
      add: { imports: [ArticlePreviewStubComponent] }
    });
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should display a loading message if status is loading', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        loading: true
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '#loading-article-list-message'
    )!;
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('Loading articles');
  });

  it('should display every article', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: mockArticleList.articlesCount,
        articles: mockArticleList.articles
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const articles = debugElement.queryAll(By.directive(ArticlePreviewStubComponent));
    expect(articles.length)
      .withContext('You should have two ArticlePreviewComponent displayed')
      .toBe(2);
    expect(articles[0].componentInstance.article).toEqual(mockArticleList.articles[0]);

    const pagination = debugElement.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should have a pagination').not.toBeNull();

    const element: HTMLElement = fixture.nativeElement;
    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks.length)
      .withContext('You should have 2 pages, as the total number of articles is 12')
      .toBe(4); // including two arrow buttons

    const activePageLink = element.querySelector('.page-item.active > a')!;
    expect(activePageLink.textContent!.trim())
      .withContext('The active page link should be 1')
      .toBe('1');
  });

  it('should dispatch a setPage action when clicking the button', fakeAsync(() => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: mockArticleList.articlesCount,
        articles: mockArticleList.articles
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks[2].textContent!.trim()).toBe('2');
    pageLinks[2].dispatchEvent(new Event('click'));
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(articleListActions.setPage({ page: 2 }));
    fixture.detectChanges();

    const activePageLink = element.querySelector('.page-item.active > a')!;
    expect(activePageLink.textContent!.trim())
      .withContext('The active page link should be 2')
      .toBe('2');
  }));

  it('should dispatch a favorite action when favoriting an article', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: mockArticleList.articlesCount,
        articles: mockArticleList.articles
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const articles = fixture.debugElement.queryAll(By.directive(ArticlePreviewStubComponent));
    const slug = mockArticleList.articles[0].slug;
    articles[0].componentInstance.favorited.emit(slug);
    expect(store.dispatch).toHaveBeenCalledWith(articleListActions.favorite({ slug }));
  });

  it('should dispatch an unfavorite action when unfavoriting an article', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: mockArticleList.articlesCount,
        articles: mockArticleList.articles
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const articles = fixture.debugElement.queryAll(By.directive(ArticlePreviewStubComponent));
    const slug = mockArticleList.articles[0].slug;
    articles[0].componentInstance.unfavorited.emit(slug);
    expect(store.dispatch).toHaveBeenCalledWith(articleListActions.unfavorite({ slug }));
  });

  it('should display an empty message if there is no articles, and status is not loading', () => {
    const fixture = TestBed.createComponent(ArticleListComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '#no-article-list-message'
    )!;
    expect(message)
      .withContext('You should have a `div` element for an empty message')
      .not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('No articles found');

    const pagination = fixture.debugElement.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should NOT have a pagination').toBeNull();
  });
});
