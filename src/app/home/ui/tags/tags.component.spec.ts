import { TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { By } from '@angular/platform-browser';

describe('TagsComponent', () => {
  const mockTags = ['dragons', 'training'];

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display a title', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('[data-test=tags-title]'));
    expect(title).withContext('You should have an `h2` element for the title').not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Popular tags');
  });

  it('should display a loading message if status is loading', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('[data-test=loading-tag-list-message]'));
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.nativeElement.textContent)
      .withContext('The message should have a text')
      .toContain('Loading tags');
  });

  it('should display every tag', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.componentInstance.tags = mockTags;
    fixture.detectChanges();

    const tagNames = fixture.debugElement.queryAll(By.css('[data-test=tag-link]'));
    expect(tagNames.length).withContext('You should have an `a` element for each tag name').toBe(2);
    expect(tagNames[0].nativeElement.textContent).toContain(mockTags[0]);
    expect(tagNames[1].nativeElement.textContent).toContain(mockTags[1]);
  });

  it('should display an empty message if there are no tags and the status is not loading', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('[data-test=no-tag-list-message]'));
    expect(message)
      .withContext('You should have a `div` element for an empty message')
      .not.toBeNull();
    expect(message.nativeElement.textContent)
      .withContext('The message should have a text')
      .toContain('No tags found');
  });

  it('should emit an output event on click', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    const component = fixture.componentInstance;
    component.tags = mockTags;
    fixture.detectChanges();

    spyOn(component.clicked, 'emit');

    const tagNames = fixture.debugElement.queryAll(By.css('[data-test=tag-link]'));
    tagNames.forEach((tagName, index) => {
      tagName.triggerEventHandler('click');
      expect(component.clicked.emit)
        .withContext('You should have the click handler on the `a` element')
        .toHaveBeenCalledWith(mockTags[index]);
    });
  });
});
