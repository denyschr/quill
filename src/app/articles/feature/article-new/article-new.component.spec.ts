import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';

import { articleNewActions, articleNewInitialState } from '../../data-access/state/article-new';
import { ArticleFormComponent } from '../../ui/article-form';

import { ArticleNewComponent } from './article-new.component';

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

  it('should dispatch a newArticle action when submitting the form', () => {
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

  it('should display backend error messages if publication fails', () => {
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

    const fixture = TestBed.createComponent(ArticleNewComponent);
    fixture.detectChanges();

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].textContent).toContain('body is a required field');
    expect(errors[1].textContent).toContain('title is a required field');
  });
});
