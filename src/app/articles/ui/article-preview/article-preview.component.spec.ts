import { TestBed } from '@angular/core/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TagListComponent } from '@app/shared/ui/tag-list';
import { Article } from '@app/articles/data-access/models';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta';

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

  it('should use ArticleMetaComponent', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(ArticleMetaComponent)))
      .withContext(
        'You might have forgot to add ArticleMetaComponent to the ArticlePreviewComponent template'
      )
      .not.toBeNull();
  });

  it('should display a favorite button', () => {
    const fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('#toggle-favorite-button')!;
    expect(button)
      .withContext('You should have a button to toggle the favoriting of an article')
      .not.toBeNull();
    expect(button.textContent)
      .withContext('The button should have the number of favorites')
      .toContain(mockArticle.favoritesCount);
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
      '#toggle-favorite-button'
    )!;
    button.click();

    expect(component.toggledFavorite.emit).toHaveBeenCalled();
  });
});
