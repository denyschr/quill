import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticleComponent } from './article.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { articleActions } from '@app/articles/data-access/state/article';
import { By } from '@angular/platform-browser';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta';
import { TagListComponent } from '@app/shared/ui/tag-list';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let store: MockStore;
  const initialState = {
    article: {
      article: {
        slug: 'title-one',
        title: 'title one',
        body: 'body',
        createdAt: new Date('10/8/2024').toString(),
        author: {
          image: 'image',
          username: 'john'
        },
        tagList: ['tag one', 'tag two']
      },
      loading: false
    },
    auth: {
      currentUser: {
        username: 'john'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.componentRef.setInput('slug', 'title-one');

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a loadArticle action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(articleActions.loadArticle({ slug: 'title-one' }));
  });

  it('should display a loading message if status is loading', () => {
    store.setState({
      ...initialState,
      article: {
        ...initialState.article,
        article: null,
        loading: true
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    const message = element.querySelector('div[data-test=article-loading]')!;
    expect(message).withContext('You need a `div` element for a loading message').not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('Loading article...');
  });

  it('should display nothing if there is no article and status is not loading', () => {
    store.setState({
      ...initialState,
      article: {
        ...initialState.article,
        article: null,
        loading: false
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    const loadingMessage = element.querySelector('div[data-test=article-loading]')!;
    expect(loadingMessage).toBeNull();
    const banner = element.querySelector('div[data-test=banner]');
    expect(banner).toBeNull();
    const page = element.querySelector('div[data-test=page]');
    expect(page).toBeNull();
  });

  it('should display a banner', () => {
    const element: HTMLElement = fixture.nativeElement;

    const banner = element.querySelector('div[data-test=banner]')!;
    expect(banner).withContext('You need a `div` element for a banner').not.toBeNull();

    const title = banner.querySelector('h1')!;
    expect(title)
      .withContext('You need an `h1` element inside the banner for a title')
      .not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('title one');

    const articleMeta = fixture.debugElement.query(By.directive(ArticleMetaComponent));
    expect(articleMeta)
      .withContext('You need `ArticleMetaComponent` inside the banner for an article meta')
      .not.toBeNull();
  });

  it('should display an edit link with a delete button if the owner', () => {
    const element: HTMLElement = fixture.nativeElement;
    const banner = element.querySelector('div[data-test=banner]')!;

    const editLink = banner.querySelector('a[href="/editor/title-one"]')!;
    expect(editLink)
      .withContext('You need an `a` element inside the banner for the link to the editor page')
      .not.toBeNull();
    expect(editLink.textContent).withContext('The link should have a text').toContain('Edit');

    const deleteButton = banner.querySelector('button')!;
    expect(deleteButton)
      .withContext('You need a `button` element inside the banner for deleting an article')
      .not.toBeNull();
    expect(deleteButton.textContent)
      .withContext('The button should have a text')
      .toContain('Delete');

    deleteButton.click();
    fixture.detectChanges();

    expect(deleteButton.hasAttribute('disabled'))
      .withContext('The button should be disabled on click ')
      .toBe(true);
    expect(store.dispatch)
      .withContext('The button should dispatch a `deleteArticle` action')
      .toHaveBeenCalledWith(articleActions.deleteArticle({ slug: 'title-one' }));
  });

  it('should display an article body', () => {
    const element: HTMLElement = fixture.nativeElement;
    const body = element.querySelector('p.lead')!;
    expect(body)
      .withContext('You need a `p` element with a class `lead` for a body')
      .not.toBeNull();
    expect(body.textContent).withContext('The body should have a text').toContain('body');
  });

  it('should display tags', () => {
    const element: HTMLElement = fixture.nativeElement;

    const tagList = fixture.debugElement.query(By.directive(TagListComponent));
    expect(tagList).withContext('You need `TagListComponent` for tags').not.toBeNull();

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You need two `li` elements for tag names').toBe(2);
    expect(tagNames[0].textContent).toContain('tag one');
    expect(tagNames[1].textContent).toContain('tag two');
  });
});
