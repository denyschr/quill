import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleListConfigModel } from '@shared/data-access/models';
import {
  articlesActions,
  selectArticleData,
  selectError as selectArticlesError,
  selectLoading as selectArticlesLoading
} from '@shared/data-access/store/articles';
import { ArticleListComponent } from '@shared/ui/article-list';
import { combineLatest } from 'rxjs';
import { PaginationComponent } from '@shared/ui/pagination';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { TagsComponent } from '@home/ui/tags';
import {
  tagsActions,
  selectTags,
  selectLoading as selectTagsLoading,
  selectError as selectTagsError
} from '@home/data-access/store/tags';

@Component({
  selector: 'ql-home',
  standalone: true,
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      <div class="container">
        <div class="row py-3">
          <div class="col-md-9">
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item">
                <a class="nav-link active">Global Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link">Your Feed</a>
              </li>
            </ul>

            @let articleData = vm.articleData;
            <ql-article-list
              [articles]="articleData?.articles"
              [loading]="vm.articlesLoading"
              [error]="vm.articlesError"
            />

            @if (articleData) {
              <ql-pagination
                url="/"
                [itemCount]="articleData.articlesCount"
                [currentPage]="currentPage"
                [limit]="limit"
              />
            }
          </div>

          <ql-tags [tags]="vm.tags" [loading]="vm.tagsLoading" [error]="vm.tagsError" />
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .nav-link {
        cursor: pointer;
      }
    `
  ],
  imports: [LetDirective, ArticleListComponent, PaginationComponent, TagsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  public currentPage = 1;
  public readonly limit = environment.limit;
  public listConfig: ArticleListConfigModel = {
    type: 'all',
    filters: {
      limit: this.limit
    }
  };

  public readonly vm$ = combineLatest({
    articleData: this.store.select(selectArticleData),
    articlesLoading: this.store.select(selectArticlesLoading),
    articlesError: this.store.select(selectArticlesError),
    tags: this.store.select(selectTags),
    tagsLoading: this.store.select(selectTagsLoading),
    tagsError: this.store.select(selectTagsError)
  });

  public constructor(
    private readonly store: Store,
    private readonly _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      this.currentPage = parseInt(params.get('page')!) || 1;
      this.fetchFeed();
    });
    this.store.dispatch(tagsActions.getTags());
  }

  public fetchFeed() {
    this.listConfig.filters.offset = this.currentPage * this.limit - this.limit;
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
