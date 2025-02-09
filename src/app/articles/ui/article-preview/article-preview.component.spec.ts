import { TestBed } from '@angular/core/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TagListComponent } from '@app/shared/ui/tag-list';
import { Article } from '@app/articles/data-access/models';

describe('ArticlePreviewComponent', () => {
  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wondered how?',
    tagList: ['dragons', 'training'],
    createdAt: new Date('02/09/2025').toString(),
    favorited: false,
    favoritesCount: 0,
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

  it('should display a link with an author avatar inside', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
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
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
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

  it('should display a favorite button', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('.article-meta > button')!;
    expect(button).withContext('You should have a button to toggle favorite').not.toBeNull();
    expect(button.classList)
      .withContext(
        'You should apply the `btn-outline-success` CSS class to the button when the article is NOT favorited'
      )
      .toContain('btn-outline-success');
    expect(button.textContent)
      .withContext('The button should have the number of favorites')
      .toContain(mockArticle.favoritesCount);

    fixture.componentRef.setInput('article', { ...mockArticle, favorited: true });
    fixture.detectChanges();

    expect(button.classList)
      .withContext(
        'You should apply the `btn-success` CSS class to the button when the article is favorited'
      )
      .toContain('btn-success');
  });

  it('should display a preview link', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    const previewLink = (fixture.nativeElement as HTMLElement).querySelector(
      `a[href="/article/${mockArticle.slug}"]`
    )!;
    expect(previewLink)
      .withContext('You should have an `a` element for the preview link')
      .not.toBeNull();

    const title = previewLink.querySelector('h3')!;
    expect(title).withContext('You should have an `h3` element for the title').not.toBeNull();
    expect(title.textContent)
      .withContext('The title should have a text')
      .toContain(mockArticle.title);

    const description = previewLink.querySelector('p')!;
    expect(description)
      .withContext('You should have a `p` element for the description')
      .not.toBeNull();
    expect(description.textContent)
      .withContext('The description should have a text')
      .toContain(mockArticle.description);

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
    expect(tagNames[0].textContent).toContain(mockArticle.tagList[0]);
    expect(tagNames[1].textContent).toContain(mockArticle.tagList[1]);
  });

  it('should emit an output event on toggle favorite', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    spyOn(component.toggledFavorite, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.article-meta > button'
    )!;
    button.click();

    expect(component.toggledFavorite.emit).toHaveBeenCalled();
  });
});
