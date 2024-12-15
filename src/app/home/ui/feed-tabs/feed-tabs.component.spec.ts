import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedTabsComponent } from './feed-tabs.component';
import { By } from '@angular/platform-browser';

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
    const element = fixture.debugElement;
    const tabLinks = element.queryAll(By.css('.nav.nav-tabs .nav-item a.nav-link'));
    expect(tabLinks.length).withContext('You should only have one tab for a global feed').toBe(1);
    expect(tabLinks[0].nativeElement.textContent).toContain('Global Feed');
  });

  it('should show two tabs if logged in', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const tabLinks = element.queryAll(By.css('.nav.nav-tabs .nav-item a.nav-link'));
    expect(tabLinks.length)
      .withContext("You should have two tabs: one for a global feed and one for the user's feed")
      .toBe(2);
    expect(tabLinks[0].nativeElement.textContent).toContain('Global Feed');
    expect(tabLinks[1].nativeElement.textContent).toContain('Your Feed');
  });

  it('should show three tabs if logged in and a tag is selected', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.componentRef.setInput('tag', 'ipsum');
    fixture.detectChanges();

    const element = fixture.debugElement;
    const tabLinks = element.queryAll(By.css('.nav.nav-tabs .nav-item a.nav-link'));
    expect(tabLinks.length)
      .withContext(
        "You should have three tabs: one for a global feed, one for the user's feed and one for the feed with the selected tag"
      )
      .toBe(3);
    expect(tabLinks[0].nativeElement.textContent).toContain('Global Feed');
    expect(tabLinks[1].nativeElement.textContent).toContain('Your Feed');
    expect(tabLinks[2].nativeElement.textContent).toContain('#ipsum');
  });

  it('should make the first tab active when showing a global feed', () => {
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const links = element.queryAll(By.css('a.nav-link'));
    expect(links.length).withContext('You should have two links').toBe(2);
    expect(links[0].nativeElement.className)
      .withContext('The first link should be active')
      .toContain('active');
    expect(links[1].nativeElement.className)
      .withContext('The second link should not be active')
      .not.toContain('active');
  });

  it("should make the second tab active when showing the user's feed", () => {
    fixture.componentRef.setInput('feedType', 'feed');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const links = element.queryAll(By.css('a.nav-link'));
    expect(links.length).withContext('You should have two links').toBe(2);
    expect(links[0].nativeElement.className)
      .withContext('The first link should not be active')
      .not.toContain('active');
    expect(links[1].nativeElement.className)
      .withContext('The second link should be active')
      .toContain('active');
  });

  it('should make the third tab active when showing a feed with the selected tag', () => {
    fixture.componentRef.setInput('feedType', 'feed');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.componentRef.setInput('tag', 'ipsum');
    fixture.detectChanges();

    const element = fixture.debugElement;
    const links = element.queryAll(By.css('a.nav-link'));
    expect(links.length).withContext('You should have three links').toBe(3);
    expect(links[0].nativeElement.className)
      .withContext('The first link should not be active')
      .not.toContain('active');
    expect(links[1].nativeElement.className)
      .withContext('The second link should not be active')
      .not.toContain('active');
    expect(links[2].nativeElement.className)
      .withContext('The third link should be active')
      .toContain('active');
  });

  it('should emit an event on feed change', () => {
    spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('feedDisabled', false);
    fixture.detectChanges();

    const element = fixture.debugElement;
    const links = element.queryAll(By.css('a.nav-link'));
    expect(links.length).withContext('You should have two links').toBe(2);

    links[1].nativeElement.click();
    expect(component.changed.emit)
      .withContext('You should emit an event on change')
      .toHaveBeenCalledWith('feed');

    fixture.componentRef.setInput('feedType', 'feed');
    fixture.detectChanges();

    links[0].nativeElement.click();
    expect(component.changed.emit)
      .withContext('You should emit an event on change')
      .toHaveBeenCalledWith('global');
  });
});
