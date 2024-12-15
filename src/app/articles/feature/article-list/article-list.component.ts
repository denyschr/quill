import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  articleListActions,
  selectArticles,
  selectConfig,
  selectLoading,
  selectTotal
} from '@articles/data-access/state/article-list';
import { combineLatest } from 'rxjs';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'ql-article-list',
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (!vm.loading) {
        <div class="mb-4">
          @for (article of vm.articles; track article.slug) {
            <ql-article-preview [article]="article" />
          } @empty {
            <div data-test="no-articles">No articles found</div>
          }
        </div>

        @if (vm.total) {
          <ngb-pagination
            [collectionSize]="vm.total"
            [pageSize]="vm.config.filters.limit ?? 10"
            [page]="vm.config.currentPage"
            size="lg"
            (pageChange)="changePage($event)"
          />
        }
      } @else {
        <div data-test="loading">Loading articles...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, NgbPagination, ArticlePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
  public readonly vm$ = combineLatest({
    articles: this.store.select(selectArticles),
    total: this.store.select(selectTotal),
    config: this.store.select(selectConfig),
    loading: this.store.select(selectLoading)
  });

  constructor(private readonly store: Store) {}

  public changePage(page: number): void {
    this.store.dispatch(articleListActions.setPage({ page }));
  }
}
