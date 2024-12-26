import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  const tags = ['tag one', 'tag two'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TagsComponent]
    });

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a title', () => {
    const element: HTMLElement = fixture.nativeElement;
    const title = element.querySelector('h2')!;
    expect(title).withContext('You need an `h2` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('Popular tags');
  });

  it('should display a loading message if status is loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('div[data-test="tags-loading"]')!;
    expect(message).withContext('You need a `div` element for a loading message').not.toBeNull();
    expect(message.textContent).toContain('Loading tags...');
  });

  it('should display every tag', () => {
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tagNames = element.querySelectorAll('a span.badge.rounded-pill');
    expect(tagNames.length)
      .withContext('You need a `span` element inside each `a` element for each tag')
      .toBe(2);
    expect(tagNames[0].textContent).toContain('tag one');
    expect(tagNames[1].textContent).toContain('tag two');
  });

  it('should display an empty message if there is no tags and status is not loading', () => {
    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('div[data-test="no-tags"]')!;
    expect(message).withContext('You need a `div` element for an empty message').not.toBeNull();
    expect(message.textContent).toContain('No tags found');
  });

  it('should emit an event on click', () => {
    spyOn(component.clicked, 'emit');
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tagNames = element.querySelectorAll('a');
    expect(tagNames.length).withContext('You need an `a` element for each tag').toBe(2);

    tagNames.forEach((tagName, index) => {
      tagName.click();
      expect(component.clicked.emit)
        .withContext('You need the click handler on the `a` element')
        .toHaveBeenCalledWith(tags[index]);
    });
  });
});
