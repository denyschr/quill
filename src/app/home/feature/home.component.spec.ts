import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ArticleListComponent } from '@shared/ui/article-list';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
      imports: [HomeComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render article list', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(ArticleListComponent)))
      .withContext(
        'You probably forgot to add `ArticleListComponent` to the `HomeComponent` template'
      )
      .not.toBeNull();
  });
});
