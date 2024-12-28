import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { articleActions, selectArticle } from '@articles/data-access/state/article';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TagListComponent } from '@shared/ui/tag-list';
import { combineLatest, filter, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'ql-article',
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (article) {
        <div class="bg-dark">
          <div class="container py-4">
            @if (vm.owner) {
              <div class="d-flex justify-content-end column-gap-2">
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
              </div>
            }

            <h1 class="text-white text-center">{{ article.title }}</h1>
            <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
              <a
                data-test="article-author-image"
                [routerLink]="['/profile', article.author.username]"
              >
                <img
                  class="rounded-circle"
                  [ngSrc]="article.author.image"
                  width="32"
                  height="32"
                  [alt]="article.author.username"
                />
              </a>
              <div>
                <a
                  data-test="article-author-name"
                  class="fs-5 link-light text-decoration-none"
                  [routerLink]="['/profile', article.author.username]"
                >
                  {{ article.author.username }}
                </a>
                <p data-test="article-created-date" class="mb-0 text-white">
                  Published on
                  <time [attr.datetime]="article.createdAt">{{
                    article.createdAt | date: 'MMM d, y'
                  }}</time>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="container py-3">
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
    </ng-container>
  `,
  styles: [
    `
      p:has(time) {
        font-size: 0.875rem;
      }
    `
  ],
  standalone: true,
  imports: [RouterLink, LetDirective, DatePipe, TagListComponent, NgOptimizedImage],
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
