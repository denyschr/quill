/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedToggleComponent } from './feed-toggle.component';

@Component({
  standalone: true,
  template: `<ql-feed-toggle
    [feedType]="feedType"
    [feedDisabled]="feedDisabled"
    [selectedTag]="selectedTag"
    (selectFeed)="selectedFeed = true"
  />`,
  imports: [FeedToggleComponent]
})
class FeedToggleTestComponent {
  public feedType = 'all';
  public feedDisabled = true;
  public selectedTag?: string;
  public selectedFeed = false;
}

describe('FeedToggleComponent', () => {
  let fixture: ComponentFixture<FeedToggleTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(FeedToggleTestComponent);
    fixture.detectChanges();
  });

  it('should display the global feed by default', () => {
    const element = fixture.nativeElement as HTMLElement;
    const globalFeed = element.querySelector<HTMLAnchorElement>('#global-feed')!;
    expect(globalFeed).not.toBeNull();
    expect(globalFeed.textContent).toContain('Global Feed');
  });

  it('should emit an event when the global feed is selected', () => {
    const element = fixture.nativeElement as HTMLElement;
    const globalFeed = element.querySelector<HTMLAnchorElement>('#global-feed')!;
    globalFeed.click();
    expect(fixture.componentInstance.selectedFeed).toBeTruthy();
  });

  it('should display the user`s feed if logged in', () => {
    fixture.componentInstance.feedDisabled = false;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const yourFeed = element.querySelector<HTMLAnchorElement>('#your-feed')!;
    expect(yourFeed).not.toBeNull();
    expect(yourFeed.textContent).toContain('Your Feed');
  });

  it('should emit an event when the user`s feed is selected', () => {
    fixture.componentInstance.feedDisabled = false;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const yourFeed = element.querySelector<HTMLAnchorElement>('#your-feed')!;
    yourFeed.click();
    expect(fixture.componentInstance.selectedFeed).toBeTruthy();
  });

  it('should display selected tag if provided', () => {
    fixture.componentInstance.selectedTag = 'ipsum';
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tag = element.querySelector<HTMLAnchorElement>('#tag')!;
    expect(tag).not.toBeNull();
    expect(tag.textContent).toContain('ipsum');
  });
});
