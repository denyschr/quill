import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ArticleEditComponent } from './article-edit.component';
import {
  articleEditActions,
  articleEditInitialState
} from '@app/articles/data-access/state/article-edit';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { ArticleFormComponent } from '@app/articles/ui/article-form';
import { articleDetailInitialState } from '@app/articles/data-access/state/article-detail';

describe('ArticleEditComponent', () => {
  let store: MockStore;
  const initialState = {
    articleEdit: articleEditInitialState,
    articleDetail: articleDetailInitialState
  };

  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wondered how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
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

    const fixture = TestBed.createComponent(ArticleEditComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector('#loading-message')!;
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.textContent).withContext('The message should have a text').toContain('Loading');
  });

  it('should dispatch an editArticle action on submit', () => {
    store.setState({
      ...initialState,
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleEditComponent);
    fixture.componentRef.setInput('slug', mockArticle.slug);
    fixture.detectChanges();

    spyOn(store, 'dispatch');

    const articleForm = fixture.debugElement.query(By.directive(ArticleFormComponent));
    expect(articleForm)
      .withContext('You should have ArticleFormComponent to display the article form')
      .not.toBeNull();

    articleForm.componentInstance.submitted.emit(mockArticle);

    expect(store.dispatch).toHaveBeenCalledWith(
      articleEditActions.editArticle({
        slug: mockArticle.slug,
        article: mockArticle
      })
    );
  });

  it('should display backend error messages if article publishing fails', () => {
    store.setState({
      ...initialState,
      articleEdit: {
        ...initialState.articleEdit,
        errors: {
          title: ['is a required field'],
          body: ['is a required field']
        }
      },
      articleDetail: {
        ...initialState.articleDetail,
        article: mockArticle
      }
    });
    store.refreshState();

    const fixture = TestBed.createComponent(ArticleEditComponent);
    fixture.detectChanges();

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = (fixture.nativeElement as HTMLElement).querySelectorAll('li:not(.badge)');
    expect(errors.length).withContext('You should have a `li` element for each error message');
    expect(errors[0].textContent).toContain('body is a required field');
    expect(errors[1].textContent).toContain('title is a required field');
  });
});
