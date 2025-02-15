import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  articleDetailActions,
  selectArticle,
  selectLoading
} from '@app/articles/data-access/state/article-detail';
import { selectCurrentUser } from '@app/auth/data-access/state';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';
import { articleListActions } from '@app/articles/data-access/state/article-list';
import { Article } from '@app/articles/data-access/models';
import { Profile } from '@app/profile/data-access/models';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta';
import { TagListComponent } from '@app/shared/ui/tag-list';
import { RouterLink } from '@angular/router';
import { LetDirective } from '@ngrx/component';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (!vm.loading) {
        @if (article) {
          <div data-test="banner" class="bg-black bg-gradient">
            <div class="container py-4">
              <h1 class="text-white">{{ article.title }}</h1>

              <ql-article-meta [article]="article">
                <div class="d-flex flex-wrap align-self-end align-items-center gap-2">
                  @if (vm.owner) {
                    <a class="btn btn-sm btn-secondary" [routerLink]="['/editor', article.slug]">
                      <span class="bi bi-pencil-square"></span>
                      Edit
                    </a>
                    <button
                      type="button"
                      class="btn btn-sm btn-danger"
                      [disabled]="deleting"
                      (click)="delete(article.slug)"
                    >
                      <span class="bi bi-trash3"></span>
                      Delete
                    </button>
                  } @else {
                    <button
                      id="toggle-follow-button"
                      type="button"
                      class="btn btn-sm"
                      [class.btn-secondary]="article.author.following"
                      [class.btn-outline-secondary]="!article.author.following"
                      (click)="toggleFollow(article.author)"
                    >
                      <span class="bi bi-plus-lg"></span>
                      {{ article.author.following ? 'Unfollow' : 'Follow' }}
                      {{ article.author.username }}
                    </button>
                    <button
                      id="toggle-favorite-button"
                      type="button"
                      class="btn btn-sm"
                      [class.btn-success]="article.favorited"
                      [class.btn-outline-success]="!article.favorited"
                      (click)="toggleFavorite(article)"
                    >
                      <span class="bi bi-heart-fill"></span>
                      {{ article.favorited ? 'Unfavorite' : 'Favorite' }}
                      ({{ article.favoritesCount }})
                    </button>
                  }
                </div>
              </ql-article-meta>
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
  imports: [LetDirective, RouterLink, ArticleMetaComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDetailComponent {
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

  public deleting = false;

  constructor(private readonly store: Store) {}

  public toggleFollow(author: Profile): void {
    if (author.following) {
      this.store.dispatch(articleDetailActions.unfollow({ username: author.username }));
    } else {
      this.store.dispatch(articleDetailActions.follow({ username: author.username }));
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
    this.deleting = true;
    this.store.dispatch(articleDetailActions.deleteArticle({ slug }));
  }
}
