import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArticleEditComponent } from './article-edit.component';
import { articleEditActions } from '@articles/data-access/state/article-edit';
import { articleActions } from '@articles/data-access/state/article';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';

describe('ArticleEditComponent', () => {
  let component: ArticleEditComponent;
  let fixture: ComponentFixture<ArticleEditComponent>;
  let store: MockStore;
  const initialState = {
    articleEdit: {
      errors: null
    },
    article: {
      article: {
        slug: 'title-one',
        title: 'title one',
        description: 'description',
        body: 'body',
        tagList: []
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleEditComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(ArticleEditComponent);
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

  it('should dispatch an editArticle action on submit', () => {
    const article = { ...initialState.article.article, body: 'updated article body' };
    const action = articleEditActions.editArticle({ slug: article.slug, article });

    component.publish(article);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should display backend errors on article publish failure', () => {
    store.setState({
      ...initialState,
      articleEdit: {
        ...initialState.articleEdit,
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
