import { TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {
  const tags = ['dragons', 'training'];

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display a title', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('h2')!;
    expect(title).withContext('You should have an `h2` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('Popular tags');
  });

  it('should display a loading message if status is loading', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector('#loading-tags-message')!;
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('Loading tags');
  });

  it('should display every tag', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    const tagNames = (fixture.nativeElement as HTMLElement).querySelectorAll('a > span.badge');
    expect(tagNames.length)
      .withContext('You should have a `span` element inside each `a` element for each tag')
      .toBe(2);
    expect(tagNames[0].textContent).toContain(tags[0]);
    expect(tagNames[1].textContent).toContain(tags[1]);
  });

  it('should display an empty message if there is no tags, and status is not loading', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector('#no-tags-message')!;
    expect(message)
      .withContext('You should have a `div` element for an empty message')
      .not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('No tags found');
  });

  it('should emit an event on click', () => {
    const fixture = TestBed.createComponent(TagsComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    spyOn(component.clicked, 'emit');

    const tagNames = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
    tagNames.forEach((tagName, index) => {
      tagName.click();
      expect(component.clicked.emit)
        .withContext('You should have the click handler on the `a` element')
        .toHaveBeenCalledWith(tags[index]);
    });
  });
});
