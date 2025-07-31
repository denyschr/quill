import { TestBed } from '@angular/core/testing';

import { ValidationDefaultsComponent } from '@/app/core/validation';

import { Article } from '../../data-access/models';

import { ArticleFormComponent } from './article-form.component';
import { By } from '@angular/platform-browser';

describe('ArticleFormComponent', () => {
  const mockArticle = {
    title: 'How to train your dragon',
    description: 'Ever wondered how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training']
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should have a disabled submit button if submitting is set to true', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.componentInstance.submitting = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement
        .query(By.css('[data-test=submit-button]'))
        .nativeElement.hasAttribute('disabled')
    )
      .withContext('Your submit button should be disabled if the form is submitted')
      .toBe(true);
  });

  it('should display a form to publish an article', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const submitButton = debugElement.query(By.css('[data-test=submit-button]'));
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();

    const submitButtonElement = submitButton.nativeElement;
    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is NOT dirty')
      .toBe(true);

    const titleInput = debugElement.query(By.css('[data-test=title-input]'));
    expect(titleInput).withContext('You should have an input for the title').not.toBeNull();
    titleInput.triggerEventHandler('focus');
    titleInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const titleRequiredError = debugElement.query(By.css('div.mb-3 > .invalid-feedback > div'));
    expect(titleRequiredError)
      .withContext('You should have an error message if the title field is required and touched')
      .not.toBeNull();
    expect(titleRequiredError.nativeElement.textContent)
      .withContext('The error message for the title field is incorrect')
      .toContain('The title is required');

    titleInput.nativeElement.value = mockArticle.title;
    titleInput.triggerEventHandler('input', { target: titleInput.nativeElement });
    fixture.detectChanges();

    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

    const descriptionInput = debugElement.query(By.css('[data-test=description-input]'));
    expect(descriptionInput)
      .withContext('You should have an input for the description')
      .not.toBeNull();
    descriptionInput.triggerEventHandler('focus');
    descriptionInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const descriptionRequiredError = debugElement.query(
      By.css('div.mb-3 > .invalid-feedback > div')
    );
    expect(descriptionRequiredError)
      .withContext(
        'You should have an error message if the description field is required and touched'
      )
      .not.toBeNull();
    expect(descriptionRequiredError.nativeElement.textContent)
      .withContext('The error message for the description field is incorrect')
      .toContain('The description is required');

    descriptionInput.nativeElement.value = mockArticle.description;
    descriptionInput.triggerEventHandler('input', { target: descriptionInput.nativeElement });
    fixture.detectChanges();

    const bodyInput = debugElement.query(By.css('[data-test=body-input]'));
    expect(bodyInput).withContext('You should have a textarea for the body').not.toBeNull();
    expect(bodyInput.nativeElement.rows)
      .withContext('The `rows` attribute of the body field is not correct')
      .toBe(8);
    bodyInput.triggerEventHandler('focus');
    bodyInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const bodyRequiredError = debugElement.query(By.css('div.mb-3 > .invalid-feedback > div'));
    expect(bodyRequiredError)
      .withContext('You should have an error message if the body field is required and touched')
      .not.toBeNull();
    expect(bodyRequiredError.nativeElement.textContent)
      .withContext('The error message for the body field is incorrect')
      .toContain('The body is required');

    bodyInput.nativeElement.value = mockArticle.body;
    bodyInput.triggerEventHandler('input', { target: bodyInput.nativeElement });
    fixture.detectChanges();

    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);
  });

  it('should populate a form with article data if provided', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const debugElement = fixture.debugElement;
    fixture.componentInstance.article = mockArticle;
    fixture.detectChanges();

    const titleInput = debugElement.query(By.css('[data-test=title-input]'));
    expect(titleInput).withContext('You should have an input for the title').not.toBeNull();
    expect(titleInput.nativeElement.value)
      .withContext('The value of the title field is not correct')
      .toBe(mockArticle.title);

    const descriptionInput = debugElement.query(By.css('[data-test=description-input]'));
    expect(descriptionInput)
      .withContext('You should have an input with the type `text` for the description')
      .not.toBeNull();
    expect(descriptionInput.nativeElement.value)
      .withContext('The value of the description field is not correct')
      .toBe(mockArticle.description);

    const bodyInput = debugElement.query(By.css('[data-test=body-input]'));
    expect(bodyInput).withContext('You should have a textarea for the body').not.toBeNull();
    expect(bodyInput.nativeElement.value)
      .withContext('The value of the body field is not correct')
      .toBe(mockArticle.body);

    const tagInput = debugElement.query(By.css('[data-test=tag-input]'));
    expect(tagInput).withContext('You should have an input for adding tags').not.toBeNull();
    expect(tagInput.nativeElement.value)
      .withContext('The value of the tag field is not correct')
      .toBe('');

    const tagNames = debugElement.queryAll(By.css('[data-test=tag]'));
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].nativeElement.textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].nativeElement.textContent).toContain(mockArticle.tagList[1]);

    const submitButton = debugElement.query(By.css('[data-test=submit-button]')).nativeElement;
    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is NOT dirty')
      .toBe(true);
  });

  it('should add a new tag on enter', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const tagInput = debugElement.query(By.css('[data-test=tag-input]'));
    const tagInputElement = tagInput.nativeElement;
    tagInputElement.value = mockArticle.tagList[0];
    const keydownEvent = {
      target: tagInputElement,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);
    expect(keydownEvent.preventDefault)
      .withContext('You should prevent the default behavior on Enter key press')
      .toHaveBeenCalled();
    expect(tagInputElement.value)
      .withContext('You should reset the tag field after adding a new tag')
      .toBe('');

    // check for empty tags
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);

    tagInputElement.value = mockArticle.tagList[1];
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);

    // check for duplicates
    tagInputElement.value = mockArticle.tagList[0];
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);
    fixture.detectChanges();

    const tagNames = debugElement.queryAll(By.css('[data-test=tag]'));
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].nativeElement.textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].nativeElement.textContent).toContain(mockArticle.tagList[1]);
  });

  it('should remove a tag when clicking the button', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const tagInput = debugElement.query(By.css('[data-test=tag-input]'));
    const tagInputElement = tagInput.nativeElement;
    tagInputElement.value = mockArticle.tagList[0];
    tagInput.triggerEventHandler('keydown.enter', {
      target: tagInputElement,
      preventDefault: () => {}
    });
    fixture.detectChanges();

    const tagNames = debugElement.queryAll(By.css('[data-test=tag]'));
    expect(tagNames.length)
      .withContext('You should have only one `li` element for the tag name')
      .toBe(1);
    expect(tagNames[0].nativeElement.textContent).toContain(mockArticle.tagList[0]);

    const removeTagButton = debugElement.query(By.css('[data-test=remove-tag-button]'));
    expect(removeTagButton)
      .withContext('You should have a button to remove the tag')
      .not.toBeNull();
    removeTagButton.triggerEventHandler('click');
    fixture.detectChanges();

    expect(debugElement.queryAll(By.css('[data-test=tag]')).length)
      .withContext('You may have forgot the click handler on the button')
      .toBe(0);
  });

  it('should emit an output event on submit', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const debugElement = fixture.debugElement;
    const component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.submitted, 'emit');

    const titleInput = debugElement.query(By.css('[data-test=title-input]'));
    titleInput.nativeElement.value = mockArticle.title;
    titleInput.triggerEventHandler('input', { target: titleInput.nativeElement });

    const descriptionInput = debugElement.query(By.css('[data-test=description-input]'));
    descriptionInput.nativeElement.value = mockArticle.description;
    descriptionInput.triggerEventHandler('input', { target: descriptionInput.nativeElement });

    const bodyInput = debugElement.query(By.css('[data-test=body-input]'));
    bodyInput.nativeElement.value = mockArticle.body;
    bodyInput.triggerEventHandler('input', { target: bodyInput.nativeElement });

    const tagInput = debugElement.query(By.css('[data-test=tag-input]'));
    const tagInputElement = tagInput.nativeElement;
    tagInputElement.value = mockArticle.tagList[0];
    const keydownEvent = {
      target: tagInputElement,
      preventDefault: () => {}
    };
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);
    tagInputElement.value = mockArticle.tagList[1];
    tagInput.triggerEventHandler('keydown.enter', keydownEvent);
    fixture.detectChanges();

    debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');

    expect(component.submitted.emit).toHaveBeenCalledWith(mockArticle);
  });
});
