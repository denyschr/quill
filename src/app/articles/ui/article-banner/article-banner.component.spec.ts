import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Article } from '../../data-access/models';

import { ArticleBannerComponent } from './article-banner.component';

describe('ArticleBannerComponent', () => {
  const mockArticle = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
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

  it('should have a title', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    fixture.componentInstance.article = mockArticle;
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('h1')!;
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.textContent)
      .withContext('The title should have a text')
      .toContain(mockArticle.title);
  });

  it('should display an edit link with a delete button if can modify', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    fixture.componentInstance.article = mockArticle;
    fixture.componentInstance.canModify = true;
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const editLink = element.querySelector(`a[href="/editor/${mockArticle.slug}"]`)!;
    expect(editLink)
      .withContext('You should have an `a` element for the link to the editor page')
      .not.toBeNull();
    expect(editLink.textContent).withContext('The link should have a text').toContain('Edit');

    const deleteButton = element.querySelector('button.btn-danger')!;
    expect(deleteButton)
      .withContext('You should have a button with a class `btn-danger` to delete the article')
      .not.toBeNull();
    expect(deleteButton.hasAttribute('disabled'))
      .withContext('Your delete button should NOT be disabled if the status is not deleting')
      .toBe(false);
    expect(deleteButton.textContent)
      .withContext('The button should have a text')
      .toContain('Delete');
  });

  it('should display a toggle follow button with a toggle favorite button if cannot modify', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    fixture.componentInstance.article = mockArticle;
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

    expect(toggleFollowButton.textContent).toContain(`Unfollow ${mockArticle.author.username}`);
    expect(toggleFavoriteButton.textContent).toContain('Unfavorite');
  });

  it('should emit an output event when clicking the delete button', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    const component = fixture.componentInstance;
    fixture.componentInstance.article = mockArticle;
    fixture.componentInstance.canModify = true;
    fixture.detectChanges();

    spyOn(component.deleted, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button.btn-danger'
    )!;
    button.click();
    fixture.detectChanges();

    expect(button.hasAttribute('disabled'))
      .withContext('Your delete button should be disabled if the status is deleting')
      .toBe(true);
    expect(component.deleted.emit).toHaveBeenCalled();
  });

  it('should emit an output event when clicking the toggle follow button', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    const component = fixture.componentInstance;
    fixture.componentInstance.article = mockArticle;
    fixture.detectChanges();

    spyOn(component.toggledFollow, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '#toggle-follow-button'
    )!;
    button.click();

    expect(component.toggledFollow.emit).toHaveBeenCalled();
  });

  it('should emit an output event when clicking the toggle favorite button', () => {
    const fixture = TestBed.createComponent(ArticleBannerComponent);
    const component = fixture.componentInstance;
    fixture.componentInstance.article = mockArticle;
    fixture.detectChanges();

    spyOn(component.toggledFavorite, 'emit');

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '#toggle-favorite-button'
    )!;
    button.click();

    expect(component.toggledFavorite.emit).toHaveBeenCalled();
  });
});
