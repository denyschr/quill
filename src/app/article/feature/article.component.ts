import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { articleActions, selectArticle } from '@article/data-access/state';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleMetaComponent } from '@shared/ui/article-meta';
import { TagListComponent } from '@shared/ui/tag-list';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  selector: 'ql-article',
  standalone: true,
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let article = vm.article;

      @if (article) {
        <div class="bg-dark">
          <div class="container py-4">
            <h1 class="text-white">{{ article.title }}</h1>

            <ql-article-meta [author]="article.author" [createdAt]="article.createdAt">
              @if (vm.owner) {
                <div class="d-flex column-gap-2">
                  <a class="btn btn-secondary btn-sm" [routerLink]="['/editor', article.slug]">
                    <i class="bi bi-pencil-square"></i>
                    Edit
                  </a>

                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    [disabled]="deleting"
                    (click)="deleteArticle()"
                  >
                    <i class="bi bi-trash3"></i>
                    Delete
                  </button>
                </div>
              }
            </ql-article-meta>
          </div>
        </div>
      }

      <div class="container py-3">
        @if (article) {
          <div class="pb-4 border-bottom">
            <p class="mb-4 fs-5">{{ article.body }}</p>
            <ql-tag-list [tags]="article.tagList" />
          </div>
        }
      </div>
    </ng-container>
  `,
  imports: [RouterLink, LetDirective, ArticleMetaComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ArticleComponent implements OnInit {
  public deleting = false;

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

  @Input()
  public slug!: string;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articleActions.getArticle({ slug: this.slug }));
  }

  public deleteArticle(): void {
    this.deleting = true;
    this.store.dispatch(articleActions.deleteArticle({ slug: this.slug }));
  }
}
