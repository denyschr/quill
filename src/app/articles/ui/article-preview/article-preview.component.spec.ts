import { TestBed } from '@angular/core/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { provideRouter } from '@angular/router';
import { getMockedArticle } from '@app/testing.spec';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TagListComponent } from '@app/shared/ui/tag-list';

describe('ArticlePreviewComponent', () => {
  const article = getMockedArticle();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should display a link with an author avatar inside', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    const image = (fixture.nativeElement as HTMLElement).querySelector(
      `a[href="/profile/${article.author.username}"] > img`
    )!;
    expect(image)
      .withContext('You should have an image for the author avatar wrapped around an `a` element')
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
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    const authorName = element.querySelector(
      `.article-info > a[href="/profile/${article.author.username}"]`
    )!;
    expect(authorName)
      .withContext('You should have an `a` element for the author name')
      .not.toBeNull();
    expect(authorName.getAttribute('href'))
      .withContext('The `href` attribute of the `a` element is not correct')
      .toBe(`/profile/${article.author.username}`);
    expect(authorName.textContent)
      .withContext('The `a` element should contain the author name')
      .toContain(article.author.username);

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(article.createdAt, 'MMM d, y');

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

  it('should display a favorite button', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('.article-meta > button')!;
    expect(button).withContext('You should have a button to toggle favorite').not.toBeNull();
    expect(button.textContent)
      .withContext('The button should contain the number of favorites')
      .toContain(article.favoritesCount);
  });

  it('should display a preview link', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    const previewLink = (fixture.nativeElement as HTMLElement).querySelector(
      `a[href="/article/${article.slug}"]`
    )!;
    expect(previewLink)
      .withContext('You should have an `a` element for the preview link')
      .not.toBeNull();

    const title = previewLink.querySelector('h3')!;
    expect(title).withContext('You should have an `h3` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain(article.title);

    const description = previewLink.querySelector('p')!;
    expect(description)
      .withContext('You should have a `p` element for the description')
      .not.toBeNull();
    expect(description.textContent)
      .withContext('The description should have a text')
      .toContain(article.description);

    const readMoreLabel = previewLink.querySelector('span')!;
    expect(readMoreLabel)
      .withContext('You should have a `span` element for the read more label')
      .not.toBeNull();
    expect(readMoreLabel.textContent)
      .withContext('The read more label should have a text')
      .toContain('Read more');

    const tagList = fixture.debugElement.query(By.directive(TagListComponent));
    expect(tagList)
      .withContext('You should use TagListComponent to display the list of tags')
      .not.toBeNull();

    const tagNames = (tagList.nativeElement as HTMLElement).querySelectorAll('li');
    expect(tagNames.length).withContext('You should have two tags displayed').toBe(2);
    expect(tagNames[0].textContent).toContain(article.tagList[0]);
    expect(tagNames[1].textContent).toContain(article.tagList[1]);
  });

  it('should emit an event on toggle favorite', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();

    spyOn(component.favorited, 'emit');
    spyOn(component.unfavorited, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.article-meta > button'
    )!;
    expect(button.classList).toContain('btn-outline-success');

    button.click();
    expect(component.favorited.emit).toHaveBeenCalledWith(article.slug);

    fixture.componentRef.setInput('article', getMockedArticle({ article: { favorited: true } }));
    fixture.detectChanges();

    expect(button.classList).toContain('btn-success');

    button.click();
    expect(component.unfavorited.emit).toHaveBeenCalledWith(article.slug);
  });
});
