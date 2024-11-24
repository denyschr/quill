import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  articlesActions,
  articlesInitialState,
  selectArticles,
  selectArticlesCount,
  selectConfig,
  selectLoading as selectArticlesLoading
} from '@shared/data-access/store/articles';
import { ArticleListComponent } from '@shared/ui/article-list';
import { combineLatest } from 'rxjs';
import { PaginationComponent } from '@shared/ui/pagination';
import { TagsComponent } from '@home/ui/tags';
import {
  selectLoading as selectTagsLoading,
  selectTags,
  tagsActions
} from '@home/data-access/store/tags';
import { FeedToggleComponent } from '@home/ui/feed-toggle';
import { selectCurrentUser } from '@auth/data-access/store';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FeedType } from '@shared/data-access/models';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      <div class="container">
        <div class="row py-4">
          <div class="col-md-9">
            <ql-feed-toggle
              [feedType]="vm.config.type"
              [feedDisabled]="!vm.authenticated"
              [selectedTag]="vm.config.filters.tag"
              (selectFeed)="setListTo($event)"
            />

            <div class="mb-4">
              <ql-article-list [articles]="vm.articles" [loading]="vm.articlesLoading" />
            </div>

            @if (vm.articlesCount) {
              <ngb-pagination
                [collectionSize]="vm.articlesCount"
                [pageSize]="vm.config.filters.limit ?? 10"
                [page]="vm.config.currentPage"
                size="lg"
                (pageChange)="onPageChanged($event)"
              />
            }
          </div>

          <div class="col-md-3">
            <ql-tags
              [tags]="vm.tags"
              [loading]="vm.tagsLoading"
              (tagClicked)="onTagClicked($event)"
            />
          </div>
        </div>
      </div>
    </ng-container>
  `,
  standalone: true,
  imports: [
    LetDirective,
    ArticleListComponent,
    PaginationComponent,
    TagsComponent,
    FeedToggleComponent,
    NgbPagination
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  public readonly vm$ = combineLatest({
    articles: this.store.select(selectArticles),
    articlesCount: this.store.select(selectArticlesCount),
    config: this.store.select(selectConfig),
    articlesLoading: this.store.select(selectArticlesLoading),
    tags: this.store.select(selectTags),
    tagsLoading: this.store.select(selectTagsLoading),
    authenticated: this.store.select(selectCurrentUser)
  });

  constructor(private readonly store: Store) {
    this.setListTo('all');
    this.store.dispatch(tagsActions.getTags());
  }

  public setListTo(type: FeedType = 'all'): void {
    const config = { ...articlesInitialState.config, type };
    this.store.dispatch(articlesActions.setConfig({ config }));
  }

  public onTagClicked(tag: string): void {
    const config = {
      ...articlesInitialState.config,
      filters: {
        ...articlesInitialState.config.filters,
        tag
      }
    };
    this.store.dispatch(articlesActions.setConfig({ config }));
  }

  public onPageChanged(page: number): void {
    this.store.dispatch(articlesActions.setPage({ page }));
  }
}
