import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleListConfig, FeedType } from '@shared/data-access/models';
import {
  articlesActions,
  selectArticlesData,
  selectError as selectArticlesError,
  selectLoading as selectArticlesLoading
} from '@shared/data-access/store/articles';
import { ArticleListComponent } from '@shared/ui/article-list';
import { combineLatest } from 'rxjs';
import { PaginationComponent } from '@shared/ui/pagination';
import { environment } from '@environment';
import { TagsComponent } from '@home/ui/tags';
import {
  selectError as selectTagsError,
  selectLoading as selectTagsLoading,
  selectTags,
  tagsActions
} from '@home/data-access/store/tags';
import { FeedToggleComponent } from '@home/ui/feed-toggle';
import { selectCurrentUser } from '@auth/data-access/store';

@Component({
  selector: 'ql-home',
  standalone: true,
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      <div class="container">
        <div class="row py-3">
          <div class="col-md-9">
            <ql-feed-toggle
              [feedType]="listConfig.type"
              [feedDisabled]="!vm.authenticated"
              [selectedTag]="listConfig.filters.tag"
              (selectFeed)="selectFeed($event)"
            />

            @let articlesData = vm.articlesData;
            <ql-article-list
              [articles]="articlesData?.articles"
              [loading]="vm.articlesLoading"
              [error]="vm.articlesError"
            />

            @if (articlesData) {
              <ql-pagination
                [itemCount]="articlesData.articlesCount"
                [currentPage]="currentPage"
                [limit]="limit"
                (selectPage)="selectPage($event)"
              />
            }
          </div>

          <ql-tags
            [tags]="vm.tags"
            [loading]="vm.tagsLoading"
            [error]="vm.tagsError"
            (selectTag)="selectTag($event)"
          />
        </div>
      </div>
    </ng-container>
  `,
  imports: [
    LetDirective,
    ArticleListComponent,
    PaginationComponent,
    TagsComponent,
    FeedToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  public currentPage = 1;
  public readonly limit = environment.limit;
  public listConfig: ArticleListConfig = {
    type: 'all',
    filters: {
      limit: this.limit
    }
  };

  public readonly vm$ = combineLatest({
    articlesData: this.store.select(selectArticlesData),
    articlesLoading: this.store.select(selectArticlesLoading),
    articlesError: this.store.select(selectArticlesError),
    tags: this.store.select(selectTags),
    tagsLoading: this.store.select(selectTagsLoading),
    tagsError: this.store.select(selectTagsError),
    authenticated: this.store.select(selectCurrentUser)
  });

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.fetchFeed();
    this.store.dispatch(tagsActions.getTags());
  }

  public selectPage(page: number): void {
    this.currentPage = page;
    this.listConfig.filters.offset = this.currentPage * this.limit - this.limit;
    this.fetchFeed();
  }

  public selectFeed(type: FeedType): void {
    this.currentPage = 1;
    this.listConfig = {
      type,
      filters: {
        limit: this.limit,
        offset: 0
      }
    };
    this.fetchFeed();
  }

  public selectTag(tag: string): void {
    this.currentPage = 1;
    this.listConfig = {
      type: 'all',
      filters: {
        limit: this.limit,
        offset: 0,
        tag
      }
    };
    this.fetchFeed();
  }

  public fetchFeed(): void {
    this.store.dispatch(
      articlesActions.getArticles({
        config: {
          ...this.listConfig,
          filters: {
            ...this.listConfig.filters
          }
        }
      })
    );
  }
}
