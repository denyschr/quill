import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleListConfigModel } from '@shared/data-access/models';
import {
  articlesActions,
  selectArticleData,
  selectError,
  selectLoading
} from '@shared/data-access/store/articles';
import { ArticleListComponent } from '@shared/ui/article-list';
import { combineLatest } from 'rxjs';
import { PaginationComponent } from '@shared/ui/pagination';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';

@Component({
  selector: 'ql-home',
  standalone: true,
  template: `
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

          <ng-container *ngrxLet="$vm; let vm">
            <ql-article-list
              [articles]="vm.data?.articles"
              [loading]="vm.loading"
              [error]="vm.error"
            />

            @if (vm.data) {
              <ql-pagination
                url="/"
                [itemCount]="vm.data.articlesCount"
                [currentPage]="currentPage"
                [limit]="limit"
              />
            }
          </ng-container>
        </div>

        <div class="col-md-3">POPULAR TAGS</div>
      </div>
    </div>
  `,
  styles: [
    `
      .nav-link {
        cursor: pointer;
      }
    `
  ],
  imports: [LetDirective, ArticleListComponent, PaginationComponent],
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

  public readonly $vm = combineLatest({
    data: this.store.select(selectArticleData),
    loading: this.store.select(selectLoading),
    error: this.store.select(selectError)
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
  }

  public fetchFeed() {
    this.listConfig.filters.offset = this.currentPage * this.limit - this.limit;
    const config = JSON.parse(JSON.stringify(this.listConfig));
    this.store.dispatch(articlesActions.getArticles({ config }));
  }
}
