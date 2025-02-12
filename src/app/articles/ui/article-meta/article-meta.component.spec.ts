import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Article } from '@app/articles/data-access/models';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta/article-meta.component';
import { DatePipe } from '@angular/common';

describe('ArticleMetaComponent', () => {
  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    createdAt: new Date('02/09/2025').toString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jack',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false
    }
  } as Article;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  it('should display a link with an author avatar inside', () => {
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

  it('should display an edit link and delete button if can modify', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('canModify', true);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const editLink = element.querySelector(`a[href="/editor/${mockArticle.slug}"]`)!;
    expect(editLink)
      .withContext('You should have an `a` element for the link to the editor page')
      .not.toBeNull();
    expect(editLink.textContent).withContext('').toContain('Edit');

    const deleteButton = element.querySelector('button.btn-danger')!;
    expect(deleteButton)
      .withContext('You should have a button to delete an article')
      .not.toBeNull();
    expect(deleteButton.hasAttribute('disabled'))
      .withContext('Your delete button should NOT be disabled if the status is not deleting')
      .toBe(false);
    expect(deleteButton.textContent)
      .withContext('The button should have a text')
      .toContain('Delete');
  });

  it('should display a toggle follow button and toggle favorite button if cannot modify', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('canModify', false);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const toggleFollowButton = element.querySelector('#toggle-follow-button')!;
    expect(toggleFollowButton)
      .withContext('You should have a button to toggle the following of the author')
      .not.toBeNull();
    expect(toggleFollowButton.textContent)
      .withContext('The button should have a text')
      .toContain(`Follow ${mockArticle.author.username}`);

    const toggleFavoriteButton = element.querySelector('#toggle-favorite-button')!;
    expect(toggleFavoriteButton)
      .withContext('You should have a button to toggle the favoriting of an article')
      .not.toBeNull();
    expect(toggleFavoriteButton.textContent)
      .withContext('The button should have the number of favorites')
      .toContain(mockArticle.favoritesCount);
    expect(toggleFavoriteButton.textContent)
      .withContext('The button should have a text')
      .toContain('Favorite');

    fixture.componentRef.setInput('article', {
      ...mockArticle,
      favorited: true,
      author: { ...mockArticle.author, following: true }
    });
    fixture.detectChanges();

    expect(toggleFollowButton.textContent)
      .withContext('The button should have a text')
      .toContain(`Unfollow ${mockArticle.author.username}`);
    expect(toggleFavoriteButton.textContent)
      .withContext('The button should have a text')
      .toContain('Unfavorite');
  });

  it('should emit an output event when clicking the delete button', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('canModify', true);
    fixture.detectChanges();

    spyOn(component.deleted, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button.btn-danger'
    )!;
    expect(button.hasAttribute('disabled')).toBe(false);
    button.click();
    fixture.detectChanges();

    expect(button.hasAttribute('disabled'))
      .withContext('Your delete button should be disabled if the status is deleting')
      .toBe(true);
    expect(component.deleted.emit).toHaveBeenCalledWith(mockArticle.slug);
  });

  it('should emit an output event when clicking the toggle follow button', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('canModify', false);
    fixture.detectChanges();

    spyOn(component.toggledFollow, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '#toggle-follow-button'
    )!;
    button.click();

    expect(component.toggledFollow.emit).toHaveBeenCalled();
  });

  it('should emit an output event when clicking the toggle favorite button', () => {
    const fixture = TestBed.createComponent(ArticleMetaComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('canModify', false);
    fixture.detectChanges();

    spyOn(component.toggledFavorite, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '#toggle-favorite-button'
    )!;
    button.click();

    expect(component.toggledFavorite.emit).toHaveBeenCalled();
  });
});
