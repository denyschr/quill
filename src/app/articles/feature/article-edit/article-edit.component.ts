import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest, filter } from 'rxjs';
import {
  articleEditActions,
  selectErrors,
  selectSubmitting
} from '@articles/data-access/state/article-edit';
import { selectArticle, selectLoading } from '@articles/data-access/state/article';
import { ArticleFormComponent } from '@articles/ui/article-form';
import { Article } from '@shared/data-access/models';
import { UnsavedChanges } from '@shared/data-access/guards';

@Component({
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <ql-article-form
              [article]="vm.article"
              [submitting]="vm.submitting"
              (published)="publish($event)"
            />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleEditComponent implements UnsavedChanges {
  public readonly vm$ = combineLatest({
    article: this.store.select(selectArticle).pipe(filter(Boolean)),
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
