import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { TagListComponent } from '@/app/shared/ui/tag-list';
import { authInitialState } from '@/app/auth/data-access/state';

import { ArticleBannerComponent } from '../../ui/article-banner';
import {
  articleDetailActions,
  articleDetailInitialState
} from '../../data-access/state/article-detail';
import { articleListActions } from '../../data-access/state/article-list';

import { ArticleDetailComponent } from './article-detail.component';

describe('ArticleDetailComponent', () => {
  let store: MockStore;
  const initialState = {
    articleDetail: articleDetailInitialState,
    auth: {
      ...authInitialState,
      currentUser: {
        username: 'jack'
      }
    }
  };

  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wondered how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training'],
    createdAt: new Date('02/09/2025').toString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jack',
      bio: 'I work at a state farm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should display a loading message if the status is loading', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        loading: true
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '#loading-article-message'
    )!;
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('Loading article');
  });

  it('should display nothing if there is no article and the status is not loading', () => {
    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('#loading-article-message');
    expect(message).withContext('You should NOT have a loading message').toBeNull();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    expect(banner).withContext('You should NOT have a banner').toBeNull();

    const body = element.querySelector('#article-body');
    expect(body).withContext('You should NOT have a body').toBeNull();
  });

  it('should display a banner', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(ArticleBannerComponent))).not.toBeNull();
  });

  it('should display a body', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const body = (fixture.nativeElement as HTMLElement).querySelector('#article-body')!;
    expect(body).withContext('You should have a `p` element for the body').not.toBeNull();
    expect(body.textContent).withContext('The body should have a text').toContain(mockArticle.body);
  });

  it('should display a list of tags', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const tagList = fixture.debugElement.query(By.directive(TagListComponent));
    expect(tagList).withContext('You should have TagListComponent in your template').not.toBeNull();

    const tagNames = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].textContent).toContain(mockArticle.tagList[1]);
  });

  it('should dispatch a follow action when following the author', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    banner.componentInstance.toggledFollow.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      articleDetailActions.follow({
        username: mockArticle.author.username
      })
    );
  });

  it('should dispatch an unfollow action when unfollowing the author', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: { ...mockArticle, author: { ...mockArticle.author, following: true } }
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    banner.componentInstance.toggledFollow.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      articleDetailActions.unfollow({
        username: mockArticle.author.username
      })
    );
  });

  it('should dispatch a favorite action when favoriting the article', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    banner.componentInstance.toggledFavorite.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.favorite({
        slug: mockArticle.slug
      })
    );
  });

  it('should dispatch an unfavorite action when unfavoriting the article', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: { ...mockArticle, favorited: true }
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    banner.componentInstance.toggledFavorite.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.unfavorite({
        slug: mockArticle.slug
      })
    );
  });

  it('should dispatch a delete action when deleting the article', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(ArticleBannerComponent));
    banner.componentInstance.deleted.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      articleDetailActions.deleteArticle({
        slug: mockArticle.slug
      })
    );
  });
});
