/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ArticlePreviewComponent } from './article-preview.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ArticleMetaComponent } from '@shared/ui/article-meta';
import { TagListComponent } from '../tag-list';

@Component({
  standalone: true,
  template: `<ql-article-preview [article]="article" />`,
  imports: [ArticlePreviewComponent]
})
class ArticlePreviewTestComponent {
  public article = {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    tagList: ['dragons', 'training'],
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false
    }
  };
}

describe('ArticlePreviewComponent', () => {
  let fixture: ComponentFixture<ArticlePreviewTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(ArticlePreviewTestComponent);
    fixture.detectChanges();
  });

  it('should use the article-meta component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(ArticleMetaComponent)))
      .withContext(
        'You probably forgot to add `ArticleMetaComponent` to the `ArticlePreviewComponent` tempalte'
      )
      .not.toBeNull();
  });

  it('should display the title and description', () => {
    const element = fixture.nativeElement as HTMLElement;

    const title = element.querySelector<HTMLAnchorElement>(
      'h3 > a[href="/article/how-to-train-your-dragon"]'
    )!;
    expect(title)
      .withContext('You should have an `a` element to display the title for the article')
      .not.toBeNull();
    expect(title.textContent).toContain('How to train your dragon');

    const description = element.querySelector<HTMLParagraphElement>('p')!;
    expect(description)
      .withContext('You should have a `p` element to display the description for the article')
      .not.toBeNull();
    expect(description.textContent).toContain('Ever wonder how?');
  });

  it('should use the tag-list component', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(TagListComponent)))
      .withContext(
        'You probably forgot to add `TagListComponent` to the `ArticlePreviewComponent` template'
      )
      .not.toBeNull();
  });
});
