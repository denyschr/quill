import { TestBed } from '@angular/core/testing';

import { FeedTabsComponent } from './feed-tabs.component';

describe('FeedTabsComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display one tab by default', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    fixture.detectChanges();

    const tabLinks = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.nav.nav-tabs > .nav-item > a.nav-link'
    );
    expect(tabLinks.length).withContext('You should only have one tab for the global feed').toBe(1);
    expect(tabLinks[0].textContent).toContain('Global Feed');
  });

  it('should display two tabs if the user is logged in', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    fixture.componentInstance.feedDisabled = false;
    fixture.detectChanges();

    const tabLinks = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.nav.nav-tabs > .nav-item > a.nav-link'
    );
    expect(tabLinks.length)
      .withContext('You should have two tabs: one for the global feed and one for the user feed')
      .toBe(2);
    expect(tabLinks[0].textContent).toContain('Global Feed');
    expect(tabLinks[1].textContent).toContain('Your Feed');
  });

  it('should display three tabs if the user is logged in and a tag is selected', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    fixture.componentInstance.feedDisabled = false;
    fixture.componentInstance.tag = 'dragons';
    fixture.detectChanges();

    const tabLinks = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.nav.nav-tabs > .nav-item > a.nav-link'
    );
    expect(tabLinks.length)
      .withContext(
        'You should have three tabs: one for the global feed, one for the user feed and one for the feed based on the selected tag'
      )
      .toBe(3);
    expect(tabLinks[0].textContent).toContain('Global Feed');
    expect(tabLinks[1].textContent).toContain('Your Feed');
    expect(tabLinks[2].textContent).toContain('#dragons');
  });

  it('should make the first tab active when displaying the global feed', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    fixture.componentInstance.feedDisabled = false;
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a.nav-link');
    expect(links.length).withContext('You should have two links').toBe(2);
    expect(links[0].className).withContext('The first link should be active').toContain('active');
    expect(links[1].className)
      .withContext('The second link should NOT be active')
      .not.toContain('active');
  });

  it('should make the second tab active when displaying the user feed', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    fixture.componentInstance.feedType = 'feed';
    fixture.componentInstance.feedDisabled = false;
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a.nav-link');
    expect(links.length).withContext('You should have two links').toBe(2);
    expect(links[0].className)
      .withContext('The first link should NOT be active')
      .not.toContain('active');
    expect(links[1].className).withContext('The second link should be active').toContain('active');
  });

  it('should make the third tab active when displaying the feed based on the selected tag', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    const component = fixture.componentInstance;
    component.feedType = 'feed';
    component.feedDisabled = false;
    component.tag = 'dragons';
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a.nav-link');
    expect(links.length).withContext('You should have three links').toBe(3);
    expect(links[0].className)
      .withContext('The first link should NOT be active')
      .not.toContain('active');
    expect(links[1].className)
      .withContext('The second link should NOT be active')
      .not.toContain('active');
    expect(links[2].className).withContext('The third link should be active').toContain('active');
  });

  it('should emit an output event on feed change', () => {
    const fixture = TestBed.createComponent(FeedTabsComponent);
    const component = fixture.componentInstance;
    component.feedDisabled = false;
    fixture.detectChanges();

    spyOn(component.changed, 'emit');

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>(
      'a.nav-link'
    );
    expect(links.length).withContext('You should have two links').toBe(2);

    links[1].click();
    expect(component.changed.emit)
      .withContext('You should have the click handler on the `a` element')
      .toHaveBeenCalledWith('feed');

    fixture.componentRef.setInput('feedType', 'feed');
    fixture.detectChanges();

    links[0].click();
    expect(component.changed.emit)
      .withContext('You should have the click handler on the `a` element')
      .toHaveBeenCalledWith('global');
  });
});
