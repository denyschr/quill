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
import { combineLatest, map } from 'rxjs';
import { PaginationComponent } from '@shared/ui/pagination';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { PopularTagsComponent } from '@home/ui/popular-tags';
import {
  popularTagsActions,
  selectTags,
  selectLoading as selectTagsLoading,
  selectError as selectTagsError
} from '@home/data-access/store/popular-tags';

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

            @let articlesData = vm.articles;
            <ql-article-list
              [articles]="articlesData.data?.articles"
              [loading]="articlesData.loading"
              [error]="articlesData.error"
            />

            @if (articlesData.data) {
              <ql-pagination
                url="/"
                [itemCount]="articlesData.data.articlesCount"
                [currentPage]="currentPage"
                [limit]="limit"
              />
            }
          </div>

          @let popularTags = vm.popularTags;
          <ql-popular-tags
            [tags]="popularTags.tags"
            [loading]="popularTags.loading"
            [error]="popularTags.error"
          />
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
  imports: [LetDirective, ArticleListComponent, PaginationComponent, PopularTagsComponent],
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
    articlesData: this.store.select(selectArticleData),
    articlesLoading: this.store.select(selectArticlesLoading),
    articlesError: this.store.select(selectArticlesError),
    popularTags: this.store.select(selectTags),
    popularTagsLoading: this.store.select(selectTagsLoading),
    popularTagsError: this.store.select(selectTagsError)
  }).pipe(
    map(
      ({
        articlesData,
        articlesLoading,
        articlesError,
        popularTags,
        popularTagsLoading,
        popularTagsError
      }) => ({
        articles: {
          data: articlesData,
          loading: articlesLoading,
          error: articlesError
        },
        popularTags: {
          tags: popularTags,
          loading: popularTagsLoading,
          error: popularTagsError
        }
      })
    )
  );

  public constructor(
    private readonly store: Store,
    private readonly _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      this.currentPage = parseInt(params.get('page')!) || 1;
      this.fetchFeed();
    });
    this.store.dispatch(popularTagsActions.getPopularTags());
  }

  public fetchFeed() {
    this.listConfig.filters.offset = this.currentPage * this.limit - this.limit;
    const config = JSON.parse(JSON.stringify(this.listConfig));
    this.store.dispatch(articlesActions.getArticles({ config }));
  }
}
