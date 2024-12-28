import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Article } from '@shared/data-access/models';
import { provideRouter } from '@angular/router';
import { ArticleMetaComponent } from './article-meta.component';

describe('ArticleMetaComponent', () => {
  let component: ArticleMetaComponent;
  let fixture: ComponentFixture<ArticlePreviewComponent>;

  const article = {
    createdAt: new Date('10/8/2024').toString(),
    author: {
      image: 'image',
      username: 'username'
    }
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleMetaComponent],
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(ArticleMetaComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a link with an image', () => {
    const element: HTMLElement = fixture.nativeElement;
    const image = element.querySelector(`a[href="/profile/${article.author.username}"] > img`)!;
    expect(image)
      .withContext('You need an image for the author inside an `a` element')
      .not.toBeNull();
    expect(image.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe(article.author.image);
    expect(image.getAttribute('width'))
      .withContext('The `width` attribute of the image is not correct')
      .toBe('32');
    expect(image.getAttribute('height'))
      .withContext('The `height` attribute of the image is not correct')
      .toBe('32');
    expect(image.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(article.author.username);
  });

  it('should display an article info', () => {
    const element: HTMLElement = fixture.nativeElement;

    const authorName = element.querySelector('a[data-test=article-author-name]')!;
    expect(authorName).withContext('You need an `a` element for the author name').not.toBeNull();
    expect(authorName.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/profile/${article.author.username}`);
    expect(authorName.textContent)
      .withContext('The `a` element should contain the author name')
      .toContain(article.author.username);

    const date = element.querySelector('p[data-test=article-created-date]')!;
    expect(date).withContext('You need a `p` element for the article created date').not.toBeNull();
    expect(date.textContent)
      .withContext('You need a `time` element inside the `p` element')
      .toContain('Published on Oct 8, 2024');

    const time = element.querySelector('p[data-test=article-created-date] > time')!;
    expect(time).withContext('You need a `time` element for the date').not.toBeNull();
    expect(time.textContent)
      .withContext('You need the `date` pipe to format the date')
      .toContain('Oct 8, 2024');
  });
});
