import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleListConfigModel } from '@shared/data-access/models';
import {
  articlesActions,
  selectArticleData,
  selectError,
  selectLoading
} from '@shared/data-access/store/articles';
import { combineLatest } from 'rxjs';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';

@Component({
  selector: 'ql-article-list',
  standalone: true,
  template: `
    <ng-container *ngrxLet="$vm; let vm">
      @let loading = vm.loading;
      @let error = vm.error;
      @let data = vm.data;

      @if (loading) {
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading articles...</span>
          </div>
        </div>
      }

      @if (error) {
        <div>{{ error }}</div>
      }

      @if (data) {
        <div class="d-flex flex-column mb-5 row-gap-4">
          @for (article of data.articles; track article.slug) {
            <ql-article-preview [article]="article" />
          }
        </div>
      }
      PAGINATION
    </ng-container>
  `,
  imports: [LetDirective, ArticlePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent implements OnInit {
  public readonly $vm = combineLatest({
    data: this.store.select(selectArticleData),
    loading: this.store.select(selectLoading),
    error: this.store.select(selectError)
  });

  @Input({ required: true })
  public config!: ArticleListConfigModel;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articlesActions.getArticles({ config: this.config }));
  }
}
