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
          </ng-container>
          PAGINATION
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
  imports: [LetDirective, ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent implements OnInit {
  public listConfig: ArticleListConfigModel = {
    type: 'all',
    filters: {}
  };
  public readonly $vm = combineLatest({
    data: this.store.select(selectArticleData),
    loading: this.store.select(selectLoading),
    error: this.store.select(selectError)
  });

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articlesActions.getArticles({ config: this.listConfig }));
  }
}
