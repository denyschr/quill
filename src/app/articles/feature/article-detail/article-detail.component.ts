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
import { TagListComponent } from '@app/shared/ui/tag-list';
import { LetDirective } from '@ngrx/component';
import { ArticleBannerComponent } from '@app/articles/ui/article-banner';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (!vm.loading) {
        @if (article) {
          <ql-article-banner
            [article]="article"
            [canModify]="vm.canModify"
            (toggledFollow)="toggleFollow(article.author)"
            (toggledFavorite)="toggleFavorite(article)"
            (deleted)="delete(article.slug)"
          />

          <div class="container py-3">
            <div class="row">
              <p id="article-body" class="lead">{{ article.body }}</p>
              @if (article.tagList.length) {
                <ql-tag-list [tags]="article.tagList" />
              }
            </div>
          </div>
        }
      } @else {
        <div id="loading-article-message">Loading article...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, ArticleBannerComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDetailComponent {
  public readonly canModify$ = combineLatest({
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
    canModify: this.canModify$
  });

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
    this.store.dispatch(articleDetailActions.deleteArticle({ slug }));
  }
}
