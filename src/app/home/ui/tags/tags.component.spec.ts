/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';
import { provideRouter } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error';
import { TagsComponent } from './tags.component';

@Component({
  standalone: true,
  template: `<ql-tags
    [tags]="tags"
    [loading]="loading"
    [error]="error"
    (selectTag)="selectedTag = true"
  />`,
  imports: [TagsComponent]
})
class TagsTestComponent {
  public tags: string[] | null = null;
  public loading = true;
  public error: string | null = null;
  public selectedTag = false;
}

describe('TagsComponent', () => {
  let fixture: ComponentFixture<TagsTestComponent>;

  const tags = ['esse', 'at', 'ipsum', 'sunt', 'maiores'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(TagsTestComponent);
    fixture.detectChanges();
  });

  it('should display a loading indicator', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext(
        'You probably forgot to add `LoadingSpinnerComponent` to the `TagsComponent` template'
      )
      .not.toBeNull();
  });

  it('should display a correct number of tags', () => {
    fixture.componentInstance.loading = false;
    fixture.componentInstance.tags = tags;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(LoadingSpinnerComponent)))
      .withContext('You should NOT have the loading indicator if tags are retrieved')
      .toBeNull();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('li').length)
      .withContext('You should have 5 tags displayed')
      .toBe(5);
  });

  it('should display an error if the retrieval of tags fails', () => {
    fixture.componentInstance.loading = false;
    fixture.componentInstance.error = 'Something went wrong';
    fixture.detectChanges();

    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext('You should NOT have a loading indicator if the retrieval of tags fails')
      .toBeNull();
    expect(element.query(By.directive(ErrorComponent)))
      .withContext('You probably forgot to add `ErrorComponent` to the `TagsComponent` template')
      .not.toBeNull();
  });

  it('should emit event on click', () => {
    fixture.componentInstance.loading = false;
    fixture.componentInstance.tags = tags;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const link = element.querySelectorAll<HTMLAnchorElement>('a')[1];
    link.click();
    expect(fixture.componentInstance.selectedTag)
      .withContext('You may have forgot the click handler on the `a` element')
      .toBeTruthy();
  });
});
