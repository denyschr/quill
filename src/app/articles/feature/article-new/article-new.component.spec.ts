import { TestBed } from '@angular/core/testing';
import { ArticleNewComponent } from './article-new.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  articleNewActions,
  articleNewInitialState
} from '@app/articles/data-access/state/article-new';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { ArticleFormComponent } from '@app/articles/ui/article-form';

describe('ArticleNewComponent', () => {
  let store: MockStore;
  const initialState = {
    articleNew: articleNewInitialState
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
  });

  it('should dispatch a newArticle action on submit', () => {
    const mockArticle = { title: 'How to train your dragon' };
    const fixture = TestBed.createComponent(ArticleNewComponent);
    fixture.detectChanges();

    spyOn(store, 'dispatch');

    const articleForm = fixture.debugElement.query(By.directive(ArticleFormComponent));
    expect(articleForm)
      .withContext('You should have ArticleFormComponent to display the article form')
      .not.toBeNull();

    articleForm.componentInstance.submitted.emit(mockArticle);

    expect(store.dispatch).toHaveBeenCalledWith(
      articleNewActions.newArticle({
        article: mockArticle
      })
    );
  });

  it('should display backend error messages if article publishing fails', () => {
    const fixture = TestBed.createComponent(ArticleNewComponent);
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

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent backend error messages')
      .not.toBeNull();

    const errors = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].textContent).toContain('body is a required field');
    expect(errors[1].textContent).toContain('title is a required field');
  });
});
