import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { FeedTabsComponent } from '@home/ui/feed-tabs';
import { articleListActions } from '@articles/data-access/state/article-list';
import { ArticleListComponent } from '@articles/feature/article-list';
import { TagsComponent } from '@home/ui/tags';
import { ArticleListConfig } from '@shared/data-access/api/models';
import { environment } from '@environment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
      } as ArticleListConfig
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show feed tabs', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(FeedTabsComponent)))
      .withContext('You need `FeedTabsComponent` for the tabs')
      .not.toBeNull();
  });

  it('should dispatch a setConfig action on feed change', () => {
    const element = fixture.debugElement;
    const feedTabsComponent = element.query(By.directive(FeedTabsComponent));
    feedTabsComponent.componentInstance.changed.emit('global');
    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.setConfig({
        config: {
          ...initialState.articleList.config,
          type: 'global'
        }
      })
    );
  });

  it('should display a list of articles', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(ArticleListComponent)))
      .withContext('You need `ArticleListComponent` for a list of articles')
      .not.toBeNull();
  });

  it('should display tags', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(TagsComponent)))
      .withContext('You need `TagsComponent` for tags')
      .not.toBeNull();
  });

  it('should dispatch a setConfig action on tag click', () => {
    const element = fixture.debugElement;
    const tagsComponent = element.query(By.directive(TagsComponent));
    tagsComponent.componentInstance.clicked.emit('tag');
    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.setConfig({
        config: {
          ...initialState.articleList.config,
          filters: {
            ...initialState.articleList.config.filters,
            tag: 'tag'
          }
        }
      })
    );
  });
});
