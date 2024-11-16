import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  editArticleActions,
  selectArticle,
  selectErrors,
  selectLoading,
  selectSubmitting
} from '@editor/data-access/store/edit-article';
import { ArticleFormComponent } from '@editor/ui/article-form';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ArticleFormData } from '@shared/data-access/models';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';
import { combineLatest, filter } from 'rxjs';

@Component({
  selector: 'ql-edit-article',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.loading) {
              <ql-loading-spinner />
            }

            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            @if (vm.article) {
              <ql-article-form
                [article]="vm.article"
                [submitting]="vm.submitting"
                (submitted)="submitArticle($event)"
              />
            }
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [LetDirective, ArticleFormComponent, LoadingSpinnerComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class EditArticleComponent implements OnInit {
  public readonly article$ = this.store.select(selectArticle).pipe(filter(Boolean));

  public readonly vm$ = combineLatest({
    article: this.article$,
    submitting: this.store.select(selectSubmitting),
    loading: this.store.select(selectLoading),
    backendErrors: this.store.select(selectErrors)
  });

  @Input()
  public slug!: string;

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(editArticleActions.getArticle({ slug: this.slug }));
  }

  public submitArticle(article: ArticleFormData): void {
    this.store.dispatch(editArticleActions.editArticle({ slug: this.slug, article }));
  }
}
