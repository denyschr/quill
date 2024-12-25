import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { Article } from '@shared/data-access/models';
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
    const element = fixture.debugElement;
    const image = element.query(By.css(`a[href="/profile/${article.author.username}"] > img`));
    expect(image)
      .withContext('You should have an image for the author inside an `a` element')
      .not.toBeNull();
    expect(image.nativeElement.getAttribute('src'))
      .withContext('The `src` attribute of the image is not correct')
      .toBe(article.author.image);
    expect(image.nativeElement.getAttribute('width'))
      .withContext('The `width` attribute of the image is not correct')
      .toBe('32');
    expect(image.nativeElement.getAttribute('height'))
      .withContext('The `height` attribute of the image is not correct')
      .toBe('32');
    expect(image.nativeElement.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is not correct')
      .toBe(article.author.username);
  });

  it('should display an article info', () => {
    const element = fixture.debugElement;

    const authorName = element.query(By.css('a[data-test="article-author-name"]'));
    expect(authorName)
      .withContext('You should have an `a` element for the author name')
      .not.toBeNull();
    expect(authorName.nativeElement.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/profile/${article.author.username}`);
    expect(authorName.nativeElement.textContent)
      .withContext('The `a` element should contain the author name')
      .toContain(article.author.username);

    const date = element.query(By.css('p[data-test="article-created-date"]'));
    expect(date)
      .withContext('You should have a `p` element for the article created date')
      .not.toBeNull();
    expect(date.nativeElement.textContent)
      .withContext('You should have a `time` element inside the `p` element')
      .toContain('Published on Oct 8, 2024');

    const time = element.query(By.css('p[data-test="article-created-date"] > time'));
    expect(time).withContext('You should have a `time` element to display the date').not.toBeNull();
    expect(time.nativeElement.textContent)
      .withContext('You should use `DatePipe` to format the date')
      .toContain('Oct 8, 2024');
  });

  it('should use FavoriteButtonComponent', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(FavoriteButtonComponent)))
      .withContext('You should have `FavoriteButtonComponent` to display a favorite button')
      .not.toBeNull();
  });

  it('should display an article preview', () => {
    const element = fixture.debugElement;

    const title = element.query(By.css(`h3 > a[href="/article/${article.slug}"]`));
    expect(title)
      .withContext('You should have an `a` element inside an `h3` element for the title')
      .not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain(article.title);

    const description = element.query(By.css('p[data-test="article-description"]'));
    expect(description)
      .withContext('You should have a `p` element for the description')
      .not.toBeNull();
    expect(description.nativeElement.textContent)
      .withContext('The description should have a text')
      .toContain(article.description);

    const readMoreLink = element.query(By.css('a[data-test="article-details-link"]'));
    expect(readMoreLink)
      .withContext('You should have an `a` element that links to the full article')
      .not.toBeNull();
    expect(readMoreLink.nativeElement.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/article/${article.slug}`);
    expect(readMoreLink.nativeElement.textContent).toContain('Read more');

    const tagList = element.query(By.directive(TagListComponent));
    expect(tagList)
      .withContext('You should have `TagListComponent` to display the list of tags')
      .not.toBeNull();

    const tagNames = element.queryAll(By.css('li'));
    expect(tagNames.length).withContext('You should have two tags displayed').toBe(2);
    expect(tagNames[0].nativeElement.textContent).toContain(article.tagList[0]);
    expect(tagNames[1].nativeElement.textContent).toContain(article.tagList[1]);
  });
});
