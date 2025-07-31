import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';

import { ArticleTabsComponent } from './article-tabs.component';
import { By } from '@angular/platform-browser';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  template: `<ql-article-tabs [username]="username" />`,
  standalone: true,
  imports: [ArticleTabsComponent]
})
class ArticleTabsTestComponent {
  public username = 'jack';
}

describe('ArticleTabsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'profile/:username',
            children: [
              {
                path: '',
                component: ArticleTabsTestComponent
              },
              {
                path: 'favorites',
                component: ArticleTabsTestComponent
              }
            ]
          }
        ])
      ]
    });
  });

  it('should display two tabs', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const tabLinks = harness.routeDebugElement!.queryAll(By.css('[data-test=article-tab-link]'));
    expect(tabLinks.length)
      .withContext('You should have two tabs: one for user articles and one for favorited articles')
      .toBe(2);
    expect(tabLinks[0].nativeElement.href).toContain('/profile/jack');
    expect(tabLinks[1].nativeElement.href).toContain('/profile/jack/favorites');
  });

  it('should make the first tab active when showing user articles', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const tabLinks = harness.routeDebugElement!.queryAll(By.css('[data-test=article-tab-link]'));
    expect(tabLinks.length).withContext('You should have two tab links').toBe(2);
    expect(tabLinks[0].nativeElement.className)
      .withContext('The first link should be active')
      .toContain('active');
    expect(tabLinks[1].nativeElement.className)
      .withContext('The second link should NOT be active')
      .not.toContain('active');
  });

  it('should make the second tab active when showing favorited articles', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack/favorites');

    const tabLinks = harness.routeDebugElement!.queryAll(By.css('[data-test=article-tab-link]'));
    expect(tabLinks.length).withContext('You should have two tab links').toBe(2);
    expect(tabLinks[0].nativeElement.className)
      .withContext('The first link should NOT be active')
      .not.toContain('active');
    expect(tabLinks[1].nativeElement.className)
      .withContext('The second link should be active')
      .toContain('active');
  });
});
