import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';

describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let store: MockStore;
  const initialState = {
    articles: {
      data: {
        articles: [
          {
            slug: 'how-to-train-your-dragon',
            title: 'How to train your dragon',
            description: 'Ever wonder how?',
            tagList: ['dragons', 'training'],
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:48:35.824Z',
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'jake',
              bio: 'I work at statefarm',
              image: 'https://i.stack.imgur.com/xHWG8.jpg',
              following: false
            }
          },
          {
            slug: 'how-to-train-your-dragon-2',
            title: 'How to train your dragon 2',
            description: 'So toothless',
            tagList: ['dragons', 'training'],
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:48:35.824Z',
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'jake',
              bio: 'I work at statefarm',
              image: 'https://i.stack.imgur.com/xHWG8.jpg',
              following: false
            }
          }
        ],
        articlesCount: 2
      },
      loading: false,
      error: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleListComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of articles', () => {
    const articlePreviews = fixture.debugElement.queryAll(By.directive(ArticlePreviewComponent));
    expect(articlePreviews.length)
      .withContext('You should have two `ArticlePreviewComponent` displayed')
      .toBe(2);
  });

  it('should use the loading-spinner component while a list of articles is being retrieved', () => {
    store.setState({ ...initialState, articles: { ...initialState.articles, loading: true } });
    fixture.detectChanges();

    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext(
        'You probably forgot to add `LoadingSpinnerComponent` to the `ArticleListComponent` template'
      )
      .not.toBeNull();
  });

  it('should display an error if the retrieval of articles fails', () => {
    store.setState({
      ...initialState,
      articles: { ...initialState.articles, error: 'Some error' }
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    const error = element.querySelector<HTMLElement>('#error')!;
    expect(error).withContext('You should have a div to display an error message').not.toBeNull();
    expect(error.textContent).toContain('Some error');
  });
});
