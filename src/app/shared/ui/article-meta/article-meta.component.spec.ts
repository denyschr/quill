/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ArticleMetaComponent } from './article-meta.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  template: `<ql-article-meta [author]="author" [createdAt]="createdAt" />`,
  imports: [ArticleMetaComponent]
})
class ArticleMetaTestComponent {
  public author = {
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    following: false
  };
  public createdAt = '2016-02-18T03:22:56.637Z';
}

describe('ArticleMetaComponent', () => {
  let fixture: ComponentFixture<ArticleMetaTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(ArticleMetaTestComponent);
    fixture.detectChanges();
  });

  it('should display meta information', () => {
    const element = fixture.nativeElement as HTMLElement;

    const profileLinks = element.querySelectorAll<HTMLAnchorElement>('a[href="/profile/jake"]')!;
    expect(profileLinks.length)
      .withContext(
        'You should have two profile links: one for the image, another for the name of the author'
      )
      .toBe(2);

    const image = profileLinks[0].querySelector<HTMLImageElement>('img')!;
    expect(image)
      .withContext('You should have an image for the author inside an `a` element')
      .not.toBeNull();
    expect(image.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe('https://i.stack.imgur.com/xHWG8.jpg');
    expect(image.getAttribute('alt'))
      .withContext('The `alt` attribute for the image is not correct')
      .toBe('jake');
    expect(profileLinks[1].textContent)
      .withContext('The second `a` element should display the name of the author')
      .toContain('jake');

    const time = element.querySelector<HTMLTimeElement>('time')!;
    expect(time)
      .withContext('You should have a `time` element for the publication date of the article')
      .not.toBeNull();
    expect(time.getAttribute('datetime'))
      .withContext('The `datetime` attribute for the publication date is not correct')
      .toBe('2016-02-18T03:22:56.637Z');
    expect(time.textContent)
      .withContext('The `time` element should display the publication date of the article')
      .toContain('2016-02-18T03:22:56.637Z');
  });
});
