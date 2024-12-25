import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags.component';
import { By } from '@angular/platform-browser';

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
    const element = fixture.debugElement;
    const title = element.query(By.css('h2'));
    expect(title)
      .withContext('The template should have an `h2` element to display the title')
      .not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Popular tags');
  });

  it('should display a loading message if status is loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const message = element.query(By.css('div[data-test="tags-loading"]'));
    expect(message)
      .withContext('The template should have a `div` element to display a loading message')
      .not.toBeNull();
    expect(message.nativeElement.textContent).toContain('Loading tags...');
  });

  it('should display every tag', () => {
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const tagNames = element.queryAll(By.css('a span.badge.rounded-pill'));
    expect(tagNames.length)
      .withContext('You should have a `span` element inside each `a` element for each tag')
      .toBe(2);
    expect(tagNames[0].nativeElement.textContent).toContain('tag one');
    expect(tagNames[1].nativeElement.textContent).toContain('tag two');
  });

  it('should display an empty message if there is no tags and status is not loading', () => {
    const element = fixture.debugElement;
    const message = element.query(By.css('div[data-test="no-tags"]'));
    expect(message)
      .withContext('The template should have a `div` element to display an empty message')
      .not.toBeNull();
    expect(message.nativeElement.textContent).toContain('No tags found');
  });

  it('should emit an event on click', () => {
    spyOn(component.clicked, 'emit');
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const tagNames = element.queryAll(By.css('a'));
    expect(tagNames.length).withContext('You should have an `a` element for each tag').toBe(2);

    tagNames.forEach((tagName, index) => {
      tagName.nativeElement.click();
      expect(component.clicked.emit)
        .withContext('You may have forgot the click handler on the `a` element')
        .toHaveBeenCalledWith(tags[index]);
    });
  });
});
