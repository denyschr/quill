import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import {
  articleEditActions,
  selectErrors,
  selectSubmitting
} from '@app/articles/data-access/state/article-edit';
import { selectArticle, selectLoading } from '@app/articles/data-access/state/article-detail';
import { ArticleFormComponent } from '@app/articles/ui/article-form';
import { Article } from '@app/articles/data-access/models';
import { UnsavedChanges } from '@app/core/utils';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (!vm.loading) {
        @if (vm.article) {
          <div class="container">
            <div class="row py-3">
              <div class="col-md-6 offset-md-3">
                @if (vm.backendErrors) {
                  <ql-backend-errors [errors]="vm.backendErrors" />
                }

                <ql-article-form
                  [article]="vm.article"
                  [submitting]="vm.submitting"
                  (submitted)="publish($event)"
                />
              </div>
            </div>
          </div>
        }
      } @else {
        <div id="loading-message">Loading...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleEditComponent implements UnsavedChanges {
  public readonly vm$ = combineLatest({
    article: this.store.select(selectArticle),
    submitting: this.store.select(selectSubmitting),
    loading: this.store.select(selectLoading),
    backendErrors: this.store.select(selectErrors)
  });

  @Input()
  public slug!: string;

  @ViewChild(ArticleFormComponent)
  public readonly articleForm!: ArticleFormComponent;

  constructor(private readonly store: Store) {}

  public hasUnsavedChanges(): boolean {
    return !this.articleForm.submitting && this.articleForm.form.dirty;
  }

  public publish(article: Partial<Article>): void {
    this.store.dispatch(articleEditActions.editArticle({ slug: this.slug, article }));
  }
}
