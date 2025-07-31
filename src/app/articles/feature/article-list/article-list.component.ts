import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { LetDirective } from '@ngrx/component';

import {
  articleListActions,
  selectArticles,
  selectConfig,
  selectLoading,
  selectTotal
} from '../../data-access/state/article-list';
import { ArticlePreviewComponent } from '../../ui/article-preview';
import { Article } from '../../data-access/models';

@Component({
  selector: 'ql-article-list',
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (!vm.loading) {
        <div class="row gap-3 mb-4">
          @for (article of vm.articles; track article.slug) {
            <ql-article-preview [article]="article" (toggledFavorite)="toggleFavorite(article)" />
          } @empty {
            <div data-test="no-article-list-message">No articles found</div>
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
        <div data-test="loading-article-list-message">Loading articles...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, NgbPagination, ArticlePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
  protected readonly vm$ = combineLatest({
    articles: this.store.select(selectArticles),
    total: this.store.select(selectTotal),
    config: this.store.select(selectConfig),
    loading: this.store.select(selectLoading)
  });

  constructor(private readonly store: Store) {}

  protected toggleFavorite(article: Article): void {
    if (article.favorited) {
      this.store.dispatch(articleListActions.unfavorite({ slug: article.slug }));
    } else {
      this.store.dispatch(articleListActions.favorite({ slug: article.slug }));
    }
  }

  protected changePage(page: number): void {
    this.store.dispatch(articleListActions.setPage({ page }));
  }
}
