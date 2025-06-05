import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import {
  articleListActions,
  articleListInitialState
} from '@/app/articles/data-access/state/article-list';
import { ArticleListComponent } from '@/app/articles/feature/article-list';

import { FeedTabsComponent } from '../ui/feed-tabs';
import { TagsComponent } from '../ui/tags';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let store: MockStore;
  const initialState = { articleList: articleListInitialState };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should display feed tabs', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(FeedTabsComponent)))
      .withContext('You should have FeedTabsComponent in your template')
      .not.toBeNull();
  });

  it('should dispatch a setConfig action on feed change', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const feedTabs = fixture.debugElement.query(By.directive(FeedTabsComponent));
    feedTabs.componentInstance.changed.emit('global');
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
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ArticleListComponent)))
      .withContext('You should have ArticleListComponent to display the list of articles')
      .not.toBeNull();
  });

  it('should display a list of tags', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(TagsComponent)))
      .withContext('You might have forgot to add TagsComponent to the HomeComponent template')
      .not.toBeNull();
  });

  it('should dispatch a setConfig action on tag click', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const tags = fixture.debugElement.query(By.directive(TagsComponent));
    tags.componentInstance.clicked.emit('dragons');
    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.setConfig({
        config: {
          ...initialState.articleList.config,
          filters: {
            ...initialState.articleList.config.filters,
            tag: 'dragons'
          }
        }
      })
    );
  });
});
