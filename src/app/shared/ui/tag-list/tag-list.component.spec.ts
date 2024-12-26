import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
  let component: TagListComponent;
  let fixture: ComponentFixture<TagListComponent>;

  const tags = ['tag one', 'tag two'];

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(TagListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tags', tags);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of tags', () => {
    const element: HTMLElement = fixture.nativeElement;
    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You need three `li` elements for tag names').toBe(2);
    expect(tagNames[0].textContent).toContain('tag one');
    expect(tagNames[1].textContent).toContain('tag two');
  });
});
