/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component } from '@angular/core';
import { ArticleListComponent } from './article-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';
import { ArticleModel } from '@shared/data-access/models';
import { provideRouter } from '@angular/router';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { ErrorComponent } from '@shared/ui/error';

@Component({
  standalone: true,
  template: `<ql-article-list [articles]="articles" [loading]="loading" [error]="error" />`,
  imports: [ArticleListComponent]
})
class ArticleListTestComponent {
  public articles: ArticleModel[] | null = null;
  public loading = true;
  public error: string | null = null;
}

describe('ArticleListComponent', () => {
  let fixture: ComponentFixture<ArticleListTestComponent>;

  const articles = [
    {
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
    },
    {
      slug: 'how-to-train-your-dragon-2',
      title: 'How to train your dragon 2',
      description: 'So toothless',
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
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(ArticleListTestComponent);
    fixture.detectChanges();
  });

  it('should display a loading indicator', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext(
        'You probably forgot to add `LoadingSpinnerComponent` to the `ArticleListComponent` template'
      )
      .not.toBeNull();
  });

  it('should display a correct number of articles', () => {
    fixture.componentInstance.loading = false;
    fixture.componentInstance.articles = articles;
    fixture.detectChanges();

    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext('You should NOT have the loading indicator if articles are retrieved')
      .toBeNull();
    expect(element.queryAll(By.directive(ArticlePreviewComponent)).length)
      .withContext('You should have two `ArticlePreviewComponent` displayed')
      .toBe(2);
  });

  it('should display an error if the retrieval of articles fails', () => {
    fixture.componentInstance.loading = false;
    fixture.componentInstance.error = 'Something went wrong';
    fixture.detectChanges();

    const element = fixture.debugElement;
    expect(element.query(By.directive(LoadingSpinnerComponent)))
      .withContext('You should NOT have a loading indicator if the retrieval of articles fails')
      .toBeNull();
    expect(element.query(By.directive(ErrorComponent)))
      .withContext(
        'You probably forgot to add `ErrorComponent` to the `ArticleListComponent` template'
      )
      .not.toBeNull();
  });
});
