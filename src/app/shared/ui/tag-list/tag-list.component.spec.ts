import { TestBed } from '@angular/core/testing';
import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display a list of tags', () => {
    const mockTags = ['dragons', 'training'];
    const fixture = TestBed.createComponent(TagListComponent);
    fixture.componentInstance.tags = mockTags;
    fixture.detectChanges();

    const tagNames = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(tagNames.length).withContext('You should have a `li` element for each tag name').toBe(2);
    expect(tagNames[0].textContent).toContain(mockTags[0]);
    expect(tagNames[1].textContent).toContain(mockTags[1]);
  });
});
