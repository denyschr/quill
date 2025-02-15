import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Article } from '@app/articles/data-access/models';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta/article-meta.component';
import { DatePipe } from '@angular/common';

describe('ArticleMetaComponent', () => {
  const mockArticle = {
    createdAt: new Date('02/09/2025').toString(),
    author: {
      username: 'jack',
      image: 'https://i.stack.imgur.com/xHWG8.jpg'
    }
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should display a link with the author avatar inside', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    const image = (fixture.nativeElement as HTMLElement).querySelector(
      `a[href="/profile/${mockArticle.author.username}"] > img`
    )!;
    expect(image)
      .withContext('You should have an image for the author avatar wrapped around an `a` element')
      .not.toBeNull();
    expect(image.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe(mockArticle.author.image);
    expect(image.getAttribute('width'))
      .withContext('The `width` attribute of the image is not correct')
      .toBe('32');
    expect(image.getAttribute('height'))
      .withContext('The `height` attribute of the image is not correct')
      .toBe('32');
    expect(image.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(mockArticle.author.username);
  });

  it('should display an article info', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const authorName = element.querySelector(
      `.article-info > a[href="/profile/${mockArticle.author.username}"]`
    )!;
    expect(authorName)
      .withContext('You should have an `a` element for the author name')
      .not.toBeNull();
    expect(authorName.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/profile/${mockArticle.author.username}`);
    expect(authorName.textContent)
      .withContext('The `a` element should have the author name')
      .toContain(mockArticle.author.username);

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(mockArticle.createdAt, 'MMM d, y');

    const date = element.querySelector('.article-info > p')!;
    expect(date)
      .withContext('You should have a `p` element for the publication date of the article')
      .not.toBeNull();
    expect(date.textContent)
      .withContext('You should have a `time` element inside the `p` element')
      .toContain(`Published on ${formattedDate}`);

    const time = date.querySelector('time')!;
    expect(time).withContext('You should have a `time` element for the date').not.toBeNull();
    expect(time.textContent)
      .withContext('You should use the `date` pipe to format the date')
      .toContain(formattedDate);
  });
});
