import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleFormComponent } from './article-form.component';
import { ValidationDefaultsComponent } from '@app/shared/ui/validation-defaults';
import { Article } from '@app/shared/data-access/api/models';

describe('ArticleFormComponent', () => {
  let component: ArticleFormComponent;
  let fixture: ComponentFixture<ArticleFormComponent>;

  const article = {
    title: 'title',
    description: 'description',
    body: 'body',
    tagList: ['tag one', 'tag two']
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleFormComponent]
    });

    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();

    fixture = TestBed.createComponent(ArticleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a disabled button if the form is incomplete or has a submitting status', () => {
    const element: HTMLElement = fixture.nativeElement;

    const button = element.querySelector('button[type=submit]')!;
    expect(button).withContext('You need a `button` element to submit the form').not.toBeNull();
    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);

    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled on submit')
      .toBe(true);
  });

  it('should be possible to publish an article if the form is complete', () => {
    const element: HTMLElement = fixture.nativeElement;

    const titleInput = element.querySelector<HTMLInputElement>('input[type=text]')!;
    expect(titleInput)
      .withContext('You need an input with the type `text` for the title')
      .not.toBeNull();
    titleInput.value = article.title;
    titleInput.dispatchEvent(new Event('input'));

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[1]!;
    expect(descriptionInput)
      .withContext('You need an input with the type `text` for the description')
      .not.toBeNull();
    descriptionInput.value = article.description;
    descriptionInput.dispatchEvent(new Event('input'));

    const bodyInput = element.querySelector('textarea')!;
    expect(bodyInput).withContext('You need a textarea for the body').not.toBeNull();
    expect(bodyInput.getAttribute('rows'))
      .withContext('The `rows` attribute of the textarea is not correct')
      .toBe('8');
    bodyInput.value = article.body;
    bodyInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.querySelector('button[type=submit]')!.hasAttribute('disabled'))
      .withContext('The button should be enabled if the form is valid')
      .toBe(false);
  });

  it('should display fields with initial values if an article is provided', () => {
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    const titleInput = element.querySelector<HTMLInputElement>('input[type=text]')!;
    expect(titleInput)
      .withContext('You need an input with the type `text` for the title')
      .not.toBeNull();
    expect(titleInput.value)
      .withContext('The value of the input is not correct')
      .toBe(article.title);

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[1]!;
    expect(descriptionInput)
      .withContext('You need an input with the type `text` for the description')
      .not.toBeNull();
    expect(descriptionInput.value)
      .withContext('The value of the input is not correct')
      .toBe(article.description);

    const bodyInput = element.querySelector('textarea')!;
    expect(bodyInput).withContext('You need a textarea for the body').not.toBeNull();
    expect(bodyInput.value).withContext('The value of the input is not correct').toBe(article.body);

    const tagNames = element.querySelectorAll('li.badge');
    expect(tagNames.length)
      .withContext('You need two `li` elements with a class `badge` for the tag names')
      .toBe(article.tagList.length);
    expect(tagNames[0].textContent).toContain(article.tagList[0]);
    expect(tagNames[1].textContent).toContain(article.tagList[1]);
  });

  it('should display error messages if fields are touched and invalid', () => {
    const element: HTMLElement = fixture.nativeElement;

    const titleInput = element.querySelector<HTMLInputElement>('input[type=text]')!;
    expect(titleInput)
      .withContext('You need an input with the type `text` for the title')
      .not.toBeNull();
    titleInput.dispatchEvent(new Event('focus'));
    titleInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const titleRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(titleRequiredError)
      .withContext('You need an error message if the title field is required and touched')
      .not.toBeNull();
    expect(titleRequiredError.textContent)
      .withContext('The error message for the title field is incorrect')
      .toContain('The title is required');

    titleInput.value = article.title;
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[1]!;
    expect(descriptionInput)
      .withContext('You need an input with the type `text` for the description')
      .not.toBeNull();
    descriptionInput.dispatchEvent(new Event('focus'));
    descriptionInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const descriptionRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(descriptionRequiredError)
      .withContext('You need an error message if the description field is required and touched')
      .not.toBeNull();
    expect(descriptionRequiredError.textContent)
      .withContext('The error message for the description field is incorrect')
      .toContain('The description is required');

    descriptionInput.value = article.description;
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const bodyInput = element.querySelector('textarea')!;
    expect(bodyInput).withContext('You need a textarea for the body').not.toBeNull();
    bodyInput.dispatchEvent(new Event('focus'));
    bodyInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const bodyRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(bodyRequiredError)
      .withContext('You need an error message if the body field is required and touched')
      .not.toBeNull();
    expect(bodyRequiredError.textContent)
      .withContext('The error message for the body field is incorrect')
      .toContain('The body is required');

    bodyInput.value = article.body;
    bodyInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  });

  it('should update the tag list when adding new tags on enter', () => {
    const element: HTMLElement = fixture.nativeElement;

    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[2]!;
    expect(tagInput).withContext('You need an input for the tag list').not.toBeNull();
    tagInput.value = article.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(tagInput.value).withContext('The input should be empty after adding a new tag').toBe('');
    tagInput.value = article.tagList[1];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    tagInput.value = '';
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    tagInput.value = article.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    const tagNames = element.querySelectorAll('li.badge');
    expect(tagNames.length)
      .withContext('You need two `li` elements with a class `badge` for the tag names')
      .toBe(article.tagList.length);
    expect(tagNames[0].textContent).toContain(article.tagList[0]);
    expect(tagNames[1].textContent).toContain(article.tagList[1]);
  });

  it('should update the tag list when removing tags on click', () => {
    const element: HTMLElement = fixture.nativeElement;

    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[2]!;
    expect(tagInput).withContext('You need an input for the tag list').not.toBeNull();
    tagInput.value = article.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    const tagNames = element.querySelectorAll('li.badge');
    expect(tagNames.length)
      .withContext('You need only one `li` element with a class `badge` for the tag name')
      .toBe(1);
    expect(tagNames[0].textContent).toContain(article.tagList[0]);

    const tagRemoveButton = tagNames[0].querySelector('button')!;
    expect(tagRemoveButton).withContext('You need a button for removing the tag').not.toBeNull();
    tagRemoveButton.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('li.badge').length)
      .withContext('The tag needs to be removed')
      .toBe(0);
  });

  it('should emit an event on submit', () => {
    const element: HTMLElement = fixture.nativeElement;
    spyOn(component.submitted, 'emit');

    const titleInput = element.querySelector<HTMLInputElement>('input[type=text]')!;
    expect(titleInput)
      .withContext('You need an input with the type `text` for the title')
      .not.toBeNull();
    titleInput.value = article.title;
    titleInput.dispatchEvent(new Event('input'));

    const descriptionInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[1]!;
    expect(descriptionInput)
      .withContext('You need an input with the type `text` for the description')
      .not.toBeNull();
    descriptionInput.value = article.description;
    descriptionInput.dispatchEvent(new Event('input'));

    const bodyInput = element.querySelector('textarea')!;
    expect(bodyInput).withContext('You need a textarea for the body').not.toBeNull();
    expect(bodyInput.getAttribute('rows'))
      .withContext('The `rows` attribute of the textarea is not correct')
      .toBe('8');
    bodyInput.value = article.body;
    bodyInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const tagInput = element.querySelectorAll<HTMLInputElement>('input[type=text]')[2]!;
    expect(tagInput).withContext('You need an input for the tag list').not.toBeNull();
    tagInput.value = article.tagList[0];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    tagInput.value = article.tagList[1];
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(component.submitted.emit).toHaveBeenCalledWith(article);
  });
});
