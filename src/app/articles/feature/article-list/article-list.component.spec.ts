/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Article } from '@app/shared/data-access/api/models';
import { By } from '@angular/platform-browser';
import { ArticlePreviewComponent } from '@app/shared/ui/article-preview';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { articleListActions } from '@app/articles/data-access/state/article-list';
import { environment } from '@env/environment.development';

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
    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('div[data-test=articles-loading]')!;
    expect(message).withContext('You need a `div` element for a loading message').not.toBeNull();
    expect(message.textContent).toContain('Loading articles...');
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

    const articles = fixture.debugElement.queryAll(By.directive(ArticlePreviewStubComponent));
    expect(articles.length).withContext('You need two `ArticlePreviewComponent` displayed').toBe(2);

    const pagination = fixture.debugElement.query(By.directive(NgbPagination));
    expect(pagination).withContext('You need a pagination').not.toBeNull();

    const element: HTMLElement = fixture.nativeElement;

    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks.length)
      .withContext('You need 2 pages, as the total number of articles is 12')
      .toBe(4); // including 2 arrow buttons

    const activePageLink = element.querySelector('.page-item.active a')!;
    expect(activePageLink.textContent!.trim())
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

    const element: HTMLElement = fixture.nativeElement;

    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks[2].textContent!.trim()).toBe('2');
    pageLinks[2].dispatchEvent(new Event('click'));
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(articleListActions.setPage({ page: 2 }));
    fixture.detectChanges();

    const activePageLink = element.querySelector('.page-item.active a')!;
    expect(activePageLink.textContent!.trim())
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

    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('div[data-test=no-articles]')!;
    expect(message).withContext('You need a `div` element for an empty message').not.toBeNull();
    expect(message.textContent).toContain('No articles found');
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

    expect(fixture.debugElement.query(By.directive(NgbPagination)))
      .withContext('You do NOT need a pagination')
      .toBeNull();
  });
});
