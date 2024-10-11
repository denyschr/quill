import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  newArticleActions,
  selectErrors,
  selectSubmitting
} from '@editor/data-access/store/new-article';
import { ArticleFormComponent } from '@editor/ui/article-form';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleFormDataModel } from '@shared/data-access/models';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ql-new-article',
  standalone: true,
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
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class NewArticleComponent {
  public readonly vm$ = combineLatest({
    submitting: this.store.select(selectSubmitting),
    backendErrors: this.store.select(selectErrors)
  });

  public constructor(private store: Store) {}

  public submitArticle(article: ArticleFormDataModel) {
    this.store.dispatch(newArticleActions.newArticle({ article }));
  }
}
