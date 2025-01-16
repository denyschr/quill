import { TestBed } from '@angular/core/testing';
import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should display a list of tags', () => {
    const fixture = TestBed.createComponent(TagListComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('tags', ['dragons', 'training']);
    fixture.detectChanges();

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].textContent).toContain('dragons');
    expect(tagNames[1].textContent).toContain('training');
  });
});
