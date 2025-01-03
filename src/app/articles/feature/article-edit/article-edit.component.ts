import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { combineLatest, filter } from 'rxjs';
import {
  articleEditActions,
  selectErrors,
  selectSubmitting
} from '@articles/data-access/state/article-edit';
import { articleActions, selectArticle, selectLoading } from '@articles/data-access/state/article';
import { ArticleFormComponent } from '@articles/ui/article-form';
import { Article } from '@shared/data-access/models';

@Component({
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <ng-container *ngrxLet="vm$; let vm">
            @if (vm.backendErrors) {
              <ql-backend-errors [errors]="vm.backendErrors" />
            }

            @if (!vm.loading) {
              @if (vm.article) {
                <ql-article-form
                  [article]="vm.article"
                  [submitting]="vm.submitting"
                  (published)="publishArticle($event)"
                />
              }
            } @else {
              <div data-test="article-edit-loading">Loading...</div>
            }
          </ng-container>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [LetDirective, ArticleFormComponent, BackendErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ArticleEditComponent implements OnInit {
  public readonly vm$ = combineLatest({
    article: this.store.select(selectArticle).pipe(filter(Boolean)),
    submitting: this.store.select(selectSubmitting),
    loading: this.store.select(selectLoading),
    backendErrors: this.store.select(selectErrors)
  });

  @Input()
  public slug!: string;

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(articleActions.loadArticle({ slug: this.slug }));
  }

  public publishArticle(article: Partial<Article>): void {
    this.store.dispatch(articleEditActions.editArticle({ slug: this.slug, article }));
  }
}
