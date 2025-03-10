import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Article } from '@app/articles/data-access/models';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import {
  articleNewActions,
  selectErrors,
  selectSubmitting
} from '@app/articles/data-access/state/article-new';
import { ArticleFormComponent } from '@app/articles/ui/article-form';
import { UnsavedChanges } from '@app/core/utils';

@Component({
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 offset-md-3">
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <ql-article-form [submitting]="vm.submitting" (submitted)="publish($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleNewComponent implements UnsavedChanges {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  @ViewChild(ArticleFormComponent)
  public readonly articleForm!: ArticleFormComponent;

  constructor(private store: Store) {}

  public hasUnsavedChanges(): boolean {
    return !this.articleForm.submitting && this.articleForm.form.dirty;
  }

  public publish(article: Partial<Article>) {
    this.store.dispatch(articleNewActions.newArticle({ article }));
  }
}
