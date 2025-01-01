import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleFormData } from '@shared/data-access/models';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest } from 'rxjs';
import {
  articleNewActions,
  selectErrors,
  selectSubmitting
} from '@articles/data-access/state/article-new';
import { ArticleFormComponent } from '@articles/ui/article-form';

@Component({
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            <ql-article-form [submitting]="vm.submitting" (submitted)="submitArticle($event)" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ArticleNewComponent {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  constructor(private store: Store) {}

  public submitArticle(article: ArticleFormData) {
    this.store.dispatch(articleNewActions.newArticle({ article }));
  }
}
