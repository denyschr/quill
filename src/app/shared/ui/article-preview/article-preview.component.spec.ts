import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { Article } from '@shared/data-access/api/models';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { FavoriteButtonComponent } from '@shared/ui/favorite-button';
import { TagListComponent } from '@shared/ui/tag-list';

describe('ArticlePreviewComponent', () => {
  let component: ArticlePreviewComponent;
  let fixture: ComponentFixture<ArticlePreviewComponent>;

  const article = {
    slug: 'title-one',
    title: 'title',
    description: 'description',
    createdAt: new Date('10/8/2024').toString(),
    author: {
      image: 'image',
      username: 'username'
    },
    tagList: ['tag one', 'tag two']
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticlePreviewComponent],
      providers: [provideRouter([]), provideMockStore()]
    });

    fixture = TestBed.createComponent(ArticlePreviewComponent);
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

  it('should display a favorite button', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(FavoriteButtonComponent)))
      .withContext('You need `FavoriteButtonComponent` for a favorite button')
      .not.toBeNull();
  });

  it('should display an article preview', () => {
    const element: HTMLElement = fixture.nativeElement;

    const title = element.querySelector(`h3 > a[href="/article/${article.slug}"]`)!;
    expect(title)
      .withContext('You need an `a` element inside an `h3` element for the title')
      .not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain(article.title);

    const description = element.querySelector('p[data-test=article-description]')!;
    expect(description).withContext('You need a `p` element for the description').not.toBeNull();
    expect(description.textContent)
      .withContext('The description should have a text')
      .toContain(article.description);

    const readMoreLink = element.querySelector('a[data-test=article-details-link]')!;
    expect(readMoreLink)
      .withContext('You need an `a` element that links to the full article')
      .not.toBeNull();
    expect(readMoreLink.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/article/${article.slug}`);
    expect(readMoreLink.textContent).toContain('Read more');

    const tagList = fixture.debugElement.query(By.directive(TagListComponent));
    expect(tagList).withContext('You need `TagListComponent` for the list of tags').not.toBeNull();

    const tagNames = element.querySelectorAll('li');
    expect(tagNames.length).withContext('You need two tags displayed').toBe(2);
    expect(tagNames[0].textContent).toContain(article.tagList[0]);
    expect(tagNames[1].textContent).toContain(article.tagList[1]);
  });
});
