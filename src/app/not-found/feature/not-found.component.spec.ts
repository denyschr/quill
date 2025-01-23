import { TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { provideRouter } from '@angular/router';

describe('NotFoundComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should have the content', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const title = element.querySelector('h1')!;
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('404');

    const subtitle = element.querySelector('h2')!;
    expect(subtitle).withContext('You should have an `h2` element for the subtitle').not.toBeNull();
    expect(subtitle.textContent)
      .withContext('The subtitle should have a text')
      .toContain('Page Not Found');

    const message = element.querySelector('p')!;
    expect(message).withContext('You should have a `p` element for the message').not.toBeNull();
    expect(message.textContent)
      .withContext('The message should have a text')
      .toContain('The page you are looking for does not exist');

    const link = element.querySelector('a[href="/"]')!;
    expect(link)
      .withContext('You should have an `a` element for the link to the home page')
      .not.toBeNull();
    expect(link.textContent).withContext('The link should have a text').toContain('Go Home');
  });
});
