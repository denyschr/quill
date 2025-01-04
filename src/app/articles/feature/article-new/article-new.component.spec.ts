import { ComponentFixture, TestBed } from '@angular/core/testing';
import ArticleNewComponent from './article-new.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Article } from '@shared/data-access/models';
import { articleNewActions } from '@articles/data-access/state/article-new';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';

describe('ArticleNewComponent', () => {
  let component: ArticleNewComponent;
  let fixture: ComponentFixture<ArticleNewComponent>;
  let store: MockStore;
  const initialState = {
    articleNew: {
      errors: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleNewComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(ArticleNewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a newArticle action on submit', () => {
    const article = { title: 'title' } as Article;
    const action = articleNewActions.newArticle({ article });

    component.publishArticle(article);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should display backend errors on article publish failure', () => {
    store.setState({
      ...initialState,
      articleNew: {
        ...initialState.articleNew,
        errors: {
          title: ['is a required field'],
          body: ['is a required field']
        }
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You need `BackendErrorsComponent` for error messages')
      .not.toBeNull();

    const errors = element.querySelectorAll('li');
    expect(errors.length).withContext('You need two `li` elements for error messages').toBe(2);
    expect(errors[0].textContent).toContain('body is a required field');
    expect(errors[1].textContent).toContain('title is a required field');
  });
});
