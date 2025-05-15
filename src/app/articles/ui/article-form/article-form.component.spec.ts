import { TestBed } from '@angular/core/testing';
import { ArticleFormComponent } from './article-form.component';
import { ValidationDefaultsComponent } from '@app/core/validation';
import { Article } from '@app/articles/data-access/models';

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

  it('should display a form to publish an article', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const submitButton = element.querySelector('button[type="submit"]')!;
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();
    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

    const titleInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(titleInput)
      .withContext('You should have an input with the type `text` for the title')
      .not.toBeNull();
    titleInput.dispatchEvent(new Event('focus'));
    titleInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const titleRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(titleRequiredError)
      .withContext('You should have an error message if the title field is required and touched')
      .not.toBeNull();
    expect(titleRequiredError.textContent)
      .withContext('The error message for the title field is incorrect')
      .toContain('The title is required');

    titleInput.value = mockArticle.title;
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    expect(descriptionInput)
      .withContext('You should have an input with the type `text` for the description')
      .not.toBeNull();
    descriptionInput.dispatchEvent(new Event('focus'));
    descriptionInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const descriptionRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(descriptionRequiredError)
      .withContext(
        'You should have an error message if the description field is required and touched'
      )
      .not.toBeNull();
    expect(descriptionRequiredError.textContent)
      .withContext('The error message for the description field is incorrect')
      .toContain('The description is required');

    descriptionInput.value = mockArticle.description;
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const bodyInput = element.querySelector('textarea')!;
    expect(bodyInput).withContext('You should have a textarea for the body').not.toBeNull();
    expect(bodyInput.rows)
      .withContext('The `rows` attribute of the body field is not correct')
      .toBe(8);
    bodyInput.dispatchEvent(new Event('focus'));
    bodyInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const bodyRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(bodyRequiredError)
      .withContext('You should have an error message if the body field is required and touched')
      .not.toBeNull();
    expect(bodyRequiredError.textContent)
      .withContext('The error message for the body field is incorrect')
      .toContain('The body is required');

    bodyInput.value = mockArticle.body;
    bodyInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);
  });

  it('should have a disabled submit button if submitting is set to true', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.componentInstance.submitting = true;
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is submitted')
      .toBe(true);
  });

  it('should populate a form with article data if provided', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.componentInstance.article = mockArticle;
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const titleInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(titleInput)
      .withContext('You should have an input with the type `text` for the title')
      .not.toBeNull();
    expect(titleInput.value)
      .withContext('The value of the title field is not correct')
      .toBe(mockArticle.title);

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    expect(descriptionInput)
      .withContext('You should have an input with the type `text` for the description')
      .not.toBeNull();
    expect(descriptionInput.value)
      .withContext('The value of the description field is not correct')
      .toBe(mockArticle.description);

    const bodyTextarea = element.querySelector('textarea')!;
    expect(bodyTextarea).withContext('You should have a textarea for the body').not.toBeNull();
    expect(bodyTextarea.value)
      .withContext('The value of the body field is not correct')
      .toBe(mockArticle.body);

    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[2]!;
    expect(tagInput)
      .withContext('You should have an input with the type `text` for tags')
      .not.toBeNull();
    expect(tagInput.value).withContext('The value of the tag field is not correct').toBe('');

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].textContent).toContain(mockArticle.tagList[1]);

    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);
  });

  it('should add new tags on enter', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[2]!;
    tagInput.value = mockArticle.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(tagInput.value)
      .withContext('You should reset the tag field after adding a new tag')
      .toBe('');
    // check for empty tags
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    tagInput.value = mockArticle.tagList[1];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    // check for duplicates
    tagInput.value = mockArticle.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].textContent).toContain(mockArticle.tagList[1]);
  });

  it('should remove tags when clicking the button', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[2]!;
    tagInput.value = mockArticle.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length)
      .withContext('You should have only one `li` element for the tag name')
      .toBe(1);
    expect(tagNames[0].textContent).toContain(mockArticle.tagList[0]);

    const removeTagButton = element.querySelector<HTMLButtonElement>('#remove-tag')!;
    expect(removeTagButton)
      .withContext('You should have a button to remove the tag')
      .not.toBeNull();
    removeTagButton.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('li').length)
      .withContext('You may have forgot the click handler on the button')
      .toBe(0);
  });

  it('should emit an output event on submit', () => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.submitted, 'emit');

    const element: HTMLElement = fixture.nativeElement;
    const titleInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    titleInput.value = mockArticle.title;
    titleInput.dispatchEvent(new Event('input'));

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    descriptionInput.value = mockArticle.description;
    descriptionInput.dispatchEvent(new Event('input'));

    const bodyTextarea = element.querySelector('textarea')!;
    bodyTextarea.value = mockArticle.body;
    bodyTextarea.dispatchEvent(new Event('input'));

    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[2]!;
    tagInput.value = mockArticle.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    tagInput.value = mockArticle.tagList[1];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(component.submitted.emit).toHaveBeenCalledWith(mockArticle);
  });
});
