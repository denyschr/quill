import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { articleActions, selectArticle, selectLoading } from '@articles/data-access/state/article';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TagListComponent } from '@shared/ui/tag-list';
import { combineLatest, filter, map } from 'rxjs';
import { ArticleMetaComponent } from '@articles/ui/article-meta';
import { articleListActions } from '@articles/data-access/state/article-list';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (!vm.loading) {
        @if (article) {
          <div data-test="banner" class="bg-dark">
            <div class="container py-4">
              <h1 class="text-white">{{ article.title }}</h1>

              <ql-article-meta
                [article]="article"
                [owner]="vm.owner"
                (favorited)="favorite($event)"
                (unfavorited)="unfavorite($event)"
                (deleted)="delete($event)"
              />
            </div>
          </div>

          <div data-test="page" class="container py-3">
            <div class="row">
              <p class="lead">{{ article.body }}</p>
              @if (article.tagList.length) {
                <ql-tag-list [tags]="article.tagList" />
              }
            </div>
          </div>
        }
      } @else {
        <div data-test="article-loading">Loading article...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, ArticleMetaComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ArticleComponent implements OnInit {
  public readonly owner$ = combineLatest({
    article: this.store.select(selectArticle),
    currentUser: this.store
      .select(selectCurrentUser)
      .pipe(filter(currentUser => currentUser !== undefined))
  }).pipe(
    map(({ article, currentUser }) => {
      if (!article || !currentUser) {
        return false;
      }
      return article.author.username === currentUser.username;
    })
  );

  public readonly vm$ = combineLatest({
    article: this.store.select(selectArticle),
    loading: this.store.select(selectLoading),
    owner: this.owner$
  });

  @Input()
  public slug!: string;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articleActions.loadArticle({ slug: this.slug }));
  }

  public favorite(slug: string): void {
    this.store.dispatch(articleListActions.favorite({ slug }));
  }

  public unfavorite(slug: string): void {
    this.store.dispatch(articleListActions.unfavorite({ slug }));
  }

  public delete(slug: string): void {
    this.store.dispatch(articleActions.deleteArticle({ slug }));
  }
}
