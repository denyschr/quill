import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticleFormDataModel, ArticleModel } from '@shared/data-access/models';
import { ValidationErrorDirective, ValidationErrorsComponent } from 'ngx-valdemort';

@Component({
  selector: 'ql-article-form',
  standalone: true,
  template: `
    <form [formGroup]="articleForm" (ngSubmit)="submit()">
      <fieldset class="mb-3" [disabled]="submitting">
        <fieldset class="mb-3">
          <label for="title" class="form-label fw-bold">Article Title</label>
          <input id="title" type="text" class="form-control" formControlName="title" />
          <val-errors controlName="title">
            <ng-template valError="required">
              <i class="bi bi-x-circle"></i>
              The title can't be blank
            </ng-template>
          </val-errors>
        </fieldset>

        <fieldset class="mb-3">
          <label for="description" class="form-label fw-bold">What's this article about?</label>
          <input id="description" type="text" class="form-control" formControlName="description" />
          <val-errors controlName="description">
            <ng-template valError="required">
              <i class="bi bi-x-circle"></i>
              The description can't be blank
            </ng-template>
          </val-errors>
        </fieldset>

        <fieldset class="mb-3">
          <label for="body" class="form-label fw-bold">Write your article (in markdown)</label>
          <textarea id="body" rows="6" class="form-control" formControlName="body"></textarea>
        </fieldset>

        <fieldset>
          <label for="tag-list" class="form-label fw-bold">Enter tags</label>
          <input
            id="tag-list"
            type="text"
            class="form-control mb-2"
            (keydown.enter)="addTag(tagInputRef)"
            #tagInputRef
          />

          @let tagList = articleForm.value.tagList;
          @if (tagList?.length) {
            <ul class="d-flex flex-wrap list-unstyled m-0 gap-2">
              @for (tag of tagList; track tag) {
                <li class="d-flex align-items-center column-gap-1 badge text-bg-secondary">
                  {{ tag }}
                  <button type="button" class="btn btn-secondary p-0" (click)="removeTag(tag)">
                    <i class="bi bi-x"></i>
                  </button>
                </li>
              }
            </ul>
          }
        </fieldset>
      </fieldset>

      <button type="submit" class="btn btn-success w-100" [disabled]="submitting">
        @if (submitting) {
          <i class="bi bi-hourglass-split"></i>
          Publishing...
        } @else {
          Publish
        }
      </button>
    </form>
  `,
  imports: [ReactiveFormsModule, ValidationErrorsComponent, ValidationErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleFormComponent {
  public titleControl = this._fb.control('', [Validators.required]);
  public descriptionControl = this._fb.control('', [Validators.required]);
  public bodyControl = this._fb.control('');
  public tagListControl = this._fb.control(<string[]>[]);

  public readonly articleForm = this._fb.group({
    title: this.titleControl,
    description: this.descriptionControl,
    body: this.bodyControl,
    tagList: this.tagListControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly submitted = new EventEmitter<ArticleFormDataModel>();

  @Input()
  public set article(article: ArticleModel) {
    this.articleForm.setValue({
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList
    });
  }

  public constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }
    const articleData = this.articleForm.getRawValue();
    this.submitted.emit(articleData);
  }

  public addTag(tagInput: HTMLInputElement): void {
    const newTag = tagInput.value.trim();
    if (!newTag || ~this.tagListControl.value.indexOf(newTag)) {
      return;
    }
    this.tagListControl.patchValue([...this.tagListControl.value, newTag]);
    tagInput.value = '';
  }

  public removeTag(tagName: string): void {
    this.tagListControl.patchValue(this.tagListControl.value.filter(tag => tag !== tagName));
  }
}
