import { ChangeDetectionStrategy, Component } from '@angular/core';
import { articleActions, selectArticle, selectLoading } from '@articles/data-access/state/article';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TagListComponent } from '@shared/ui/tag-list';
import { combineLatest, filter, map } from 'rxjs';
import { ArticleMetaComponent } from '@articles/ui/article-meta';
import { articleListActions } from '@articles/data-access/state/article-list';
import { Article, Profile } from '@shared/data-access/models';

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
                [canModify]="vm.owner"
                (toggledFollow)="toggleFollow(article.author)"
                (toggledFavorite)="toggleFavorite(article)"
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
export class ArticleComponent {
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

  constructor(private readonly store: Store) {}

  public toggleFollow(author: Profile): void {
    if (author.following) {
      this.store.dispatch(articleActions.unfollow({ username: author.username }));
    } else {
      this.store.dispatch(articleActions.follow({ username: author.username }));
    }
  }

  public toggleFavorite(article: Article): void {
    if (article.favorited) {
      this.store.dispatch(articleListActions.unfavorite({ slug: article.slug }));
    } else {
      this.store.dispatch(articleListActions.favorite({ slug: article.slug }));
    }
  }

  public delete(slug: string): void {
    this.store.dispatch(articleActions.deleteArticle({ slug }));
  }
}
