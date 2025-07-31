import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should display the content', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const statusCode = debugElement.query(By.css('[data-test=status-code]'));
    expect(statusCode)
      .withContext('You should have an `h1` element for the status code')
      .not.toBeNull();
    expect(statusCode.nativeElement.textContent)
      .withContext('The status code should have a text')
      .toContain('404');

    const title = debugElement.query(By.css('[data-test=title]'));
    expect(title).withContext('You should have an `h2` element for the title').not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Page Not Found');

    const description = debugElement.query(By.css('[data-test=description]'));
    expect(description)
      .withContext('You should have a `p` element for the description')
      .not.toBeNull();
    expect(description.nativeElement.textContent)
      .withContext('The description should have a text')
      .toContain('The page you are looking for does not exist');

    const redirectLink = debugElement.query(By.css('[data-test=redirect-link]'));
    expect(redirectLink)
      .withContext('You should have an `a` element for the link to the home page')
      .not.toBeNull();
    expect(redirectLink.nativeElement.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe('/');
    expect(redirectLink.nativeElement.textContent)
      .withContext('The link should have a text')
      .toContain('Go Home');
  });
});
