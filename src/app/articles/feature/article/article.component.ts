import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { articleActions, selectArticle, selectLoading } from '@articles/data-access/state/article';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TagListComponent } from '@shared/ui/tag-list';
import { combineLatest, filter, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ArticleMetaComponent } from '@articles/ui/article-meta';
import { FavoriteButtonComponent } from '@shared/ui/favorite-button';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (!vm.loading) {
        @if (article) {
          <div data-test="banner" class="bg-dark">
            <div class="container py-4">
              <div class="d-flex justify-content-end column-gap-2">
                @if (vm.owner) {
                  <a class="btn btn-sm btn-secondary" [routerLink]="['/editor', article.slug]">
                    <i class="bi bi-pencil-square"></i>
                    Edit
                  </a>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    [disabled]="deleting"
                    (click)="deleteArticle()"
                  >
                    <i class="bi bi-trash3"></i>
                    Delete
                  </button>
                } @else {
                  <ql-favorite-button
                    [favorited]="article.favorited"
                    [favoritesCount]="article.favoritesCount"
                    [slug]="article.slug"
                  />
                }
              </div>
              <h1 class="text-white text-center">{{ article.title }}</h1>

              <ql-article-meta [article]="article" />
            </div>
          </div>

          <div data-test="page" class="container py-3">
            <div class="row">
              <div class="col-lg-8 mx-auto">
                <p class="lead">{{ article.body }}</p>
                @if (article.tagList.length) {
                  <ql-tag-list [tags]="article.tagList" />
                }
              </div>
            </div>
          </div>
        }
      } @else {
        <div data-test="article-loading">Loading article...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [
    RouterLink,
    LetDirective,
    ArticleMetaComponent,
    TagListComponent,
    FavoriteButtonComponent
  ],
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

  public deleting = false;

  @Input()
  public slug!: string;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articleActions.loadArticle({ slug: this.slug }));
  }

  public deleteArticle(): void {
    this.deleting = true;
    this.store.dispatch(articleActions.deleteArticle({ slug: this.slug }));
  }
}
