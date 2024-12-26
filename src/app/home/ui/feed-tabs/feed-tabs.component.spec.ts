import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedTabsComponent } from './feed-tabs.component';

describe('FeedTabsComponent', () => {
  let component: FeedTabsComponent;
  let fixture: ComponentFixture<FeedTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeedTabsComponent]
    });

    fixture = TestBed.createComponent(FeedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show one tab by default', () => {
    const element: HTMLElement = fixture.nativeElement;
    const tabLinks = element.querySelectorAll('.nav.nav-tabs .nav-item a.nav-link');
    expect(tabLinks.length).withContext('You need only one tab for the global feed').toBe(1);
    expect(tabLinks[0].textContent).toContain('Global Feed');
  });

  it('should show two tabs if logged in', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tabLinks = element.querySelectorAll('.nav.nav-tabs .nav-item a.nav-link');
    expect(tabLinks.length)
      .withContext("You need two tabs: one for the global feed and one for the user's feed")
      .toBe(2);
    expect(tabLinks[0].textContent).toContain('Global Feed');
    expect(tabLinks[1].textContent).toContain('Your Feed');
  });

  it('should show three tabs if logged in and the tag is selected', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.componentRef.setInput('tag', 'ipsum');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tabLinks = element.querySelectorAll('.nav.nav-tabs .nav-item a.nav-link');
    expect(tabLinks.length)
      .withContext(
        "You need three tabs: one for the global feed, one for the user's feed and one for a feed with the selected tag"
      )
      .toBe(3);
    expect(tabLinks[0].textContent).toContain('Global Feed');
    expect(tabLinks[1].textContent).toContain('Your Feed');
    expect(tabLinks[2].textContent).toContain('#ipsum');
  });

  it('should make the first tab active when showing a global feed', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const links = element.querySelectorAll('a.nav-link');
    expect(links.length).withContext('You need two links').toBe(2);
    expect(links[0].className).withContext('The first link should be active').toContain('active');
    expect(links[1].className)
      .withContext('The second link should not be active')
      .not.toContain('active');
  });

  it("should make the second tab active when showing the user's feed", () => {
    fixture.componentRef.setInput('feedType', 'feed');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const links = element.querySelectorAll('a.nav-link');
    expect(links.length).withContext('You need two links').toBe(2);
    expect(links[0].className)
      .withContext('The first link should not be active')
      .not.toContain('active');
    expect(links[1].className).withContext('The second link should be active').toContain('active');
  });

  it('should make the third tab active when showing a feed with the selected tag', () => {
    fixture.componentRef.setInput('feedType', 'feed');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.componentRef.setInput('tag', 'ipsum');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const links = element.querySelectorAll('a.nav-link');
    expect(links.length).withContext('You need three links').toBe(3);
    expect(links[0].className)
      .withContext('The first link should not be active')
      .not.toContain('active');
    expect(links[1].className)
      .withContext('The second link should not be active')
      .not.toContain('active');
    expect(links[2].className).withContext('The third link should be active').toContain('active');
  });

  it('should emit an event on feed change', () => {
    spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const links = element.querySelectorAll<HTMLAnchorElement>('a.nav-link');
    expect(links.length).withContext('You need two links').toBe(2);

    links[1].click();
    expect(component.changed.emit)
      .withContext('You need the click handler on the `a` element')
      .toHaveBeenCalledWith('feed');

    fixture.componentRef.setInput('feedType', 'feed');
    fixture.detectChanges();

    links[0].click();
    expect(component.changed.emit)
      .withContext('You need the click handler on the `a` element')
      .toHaveBeenCalledWith('global');
  });
});
