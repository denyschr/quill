/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { environment } from '@environment';
import { Article } from '@shared/data-access/models';
import { By } from '@angular/platform-browser';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { articleListActions } from '@articles/data-access/state/article-list';

@Component({
  selector: 'ql-article-preview',
  template: '<h3>{{ article.title }}</h3>',
  standalone: true
})
class ArticlePreviewStubComponent {
  @Input({ required: true })
  public article!: Article;
}

describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let store: MockStore;
  const initialState = {
    articleList: {
      articles: [],
      total: 0,
      config: {
        type: 'global',
        currentPage: 1,
        filters: {
          limit: environment.limit
        }
      },
      loading: true
    }
  };

  beforeEach(() => {
    TestBed.overrideComponent(ArticleListComponent, {
      remove: {
        imports: [ArticlePreviewComponent]
      },
      add: {
        imports: [ArticlePreviewStubComponent]
      }
    });
    TestBed.configureTestingModule({
      imports: [ArticleListComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading message if status is loading', () => {
    const element = fixture.debugElement;
    const message = element.query(By.css('div[data-test="loading"]'));
    expect(message)
      .withContext('The template should have a `div` element to display a loading message')
      .not.toBeNull();
    expect(message.nativeElement.textContent).toContain('Loading articles...');
  });

  it('should display every article', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: 12,
        articles: [
          { slug: 'title-one', title: 'title one' },
          { slug: 'title-two', title: 'title two' }
        ],
        loading: false
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;
    const articles = element.queryAll(By.directive(ArticlePreviewStubComponent));
    expect(articles.length)
      .withContext('You should have 2 `ArticlePreviewComponent` displayed')
      .toBe(2);

    const pagination = element.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should have a pagination').not.toBeNull();

    const pageLinks = element.queryAll(By.css('a.page-link'));
    expect(pageLinks.length)
      .withContext('You should have 2 pages, as the total number of articles is 12')
      .toBe(4); // including 2 arrow buttons

    const activePageLink = element.query(By.css('.page-item.active a'));
    expect(activePageLink.nativeElement.textContent.trim())
      .withContext('The active page link should be 1')
      .toBe('1');
  });

  it('should dispatch a setPage action when clicking the button', fakeAsync(() => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        total: 12,
        articles: [
          { slug: 'title-one', title: 'title one' },
          { slug: 'title-two', title: 'title two' }
        ],
        loading: false
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;

    const pageLinks = element.queryAll(By.css('a.page-link'));
    expect(pageLinks[2].nativeElement.textContent.trim()).toBe('2');
    pageLinks[2].nativeElement.dispatchEvent(new Event('click'));
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(articleListActions.setPage({ page: 2 }));
    fixture.detectChanges();

    const activePageLink = element.query(By.css('.page-item.active a'));
    expect(activePageLink.nativeElement.textContent.trim())
      .withContext('The active page link should be 2')
      .toBe('2');
  }));

  it('should display an empty message if there is no articles and status is not loading', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        loading: false
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;
    const message = element.query(By.css('div[data-test="no-articles"]'));
    expect(message)
      .withContext('The template should have a `div` element to display an empty message')
      .not.toBeNull();
    expect(message.nativeElement.textContent).toContain('No articles found');
  });

  it('should not display a pagination if there is no articles', () => {
    store.setState({
      ...initialState,
      articleList: {
        ...initialState.articleList,
        loading: false
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;
    const pagination = element.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should NOT have a pagination').toBeNull();
  });
});
