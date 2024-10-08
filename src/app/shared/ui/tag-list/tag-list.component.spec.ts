/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagListComponent } from './tag-list.component';

@Component({
  standalone: true,
  template: `<ql-tag-list [tags]="tags" />`,
  imports: [TagListComponent]
})
class TagListTestComponent {
  public tags = ['foo', 'bar', 'ipsum'];
}

describe('TagListComponent', () => {
  let fixture: ComponentFixture<TagListTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(TagListTestComponent);
    fixture.detectChanges();
  });

  it('should render a list of tags', () => {
    const element = fixture.nativeElement as HTMLElement;
    const tags = element.querySelectorAll<HTMLLIElement>('li');
    expect(tags.length).withContext('You should have 3 `li` elements displayed').toBe(3);
  });
});
