import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article, ArticleFormData } from '@shared/data-access/models';
import { ValidationErrorsComponent } from 'ngx-valdemort';

@Component({
  selector: 'ql-article-form',
  template: `
    <form [formGroup]="articleForm" (ngSubmit)="publish()">
      <div class="mb-3">
        <label for="title" class="form-label">Article title</label>
        <input id="title" type="text" class="form-control" formControlName="title" />
        <val-errors controlName="title" label="The title" />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">What's this article about?</label>
        <input id="description" type="text" class="form-control" formControlName="description" />
        <val-errors controlName="description" label="The description" />
      </div>

      <div class="mb-3">
        <label for="body" class="form-label">Write your article (in markdown)</label>
        <textarea id="body" rows="8" class="form-control" formControlName="body"></textarea>
        <val-errors controlName="body" label="The body" />
      </div>

      <div class="mb-3">
        <label for="tag-list" class="form-label">Enter tags</label>
        <input
          id="tag-list"
          type="text"
          class="form-control mb-2"
          #tagInput
          (keydown.enter)="addTag(tagInput)"
        />
        @let tagList = tagListControl.value;
        @if (tagList.length) {
          <ul data-test="article-tag-list" class="d-flex flex-wrap gap-2 list-unstyled m-0">
            @for (tag of tagList; track tag) {
              <li
                class="d-flex align-items-center column-gap-1 badge rounded-pill text-bg-secondary"
              >
                <span>{{ tag }}</span>
                <button
                  type="button"
                  class="btn btn-secondary p-0 border-0"
                  (click)="removeTag(tag)"
                >
                  <i class="bi bi-x"></i>
                </button>
              </li>
            }
          </ul>
        }
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="articleForm.invalid || submitting">
        Publish
      </button>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleFormComponent {
  public readonly titleControl = this._fb.control('', [Validators.required]);
  public readonly descriptionControl = this._fb.control('', [Validators.required]);
  public readonly bodyControl = this._fb.control('', [Validators.required]);
  public readonly tagListControl = this._fb.control(<string[]>[]);

  public readonly articleForm = this._fb.group({
    title: this.titleControl,
    description: this.descriptionControl,
    body: this.bodyControl,
    tagList: this.tagListControl
  });

  @Input({ required: true })
  public submitting!: boolean;

  @Output()
  public readonly published = new EventEmitter<ArticleFormData>();

  @Input()
  public set article(article: Article) {
    this.articleForm.setValue({
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList
    });
  }

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  public publish(): void {
    this.published.emit(this.articleForm.getRawValue());
  }

  public addTag(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim();
    if (!tag || ~this.tagListControl.value.indexOf(tag)) {
      return;
    }
    this.tagListControl.patchValue([...this.tagListControl.value, tag]);
    tagInput.value = '';
  }

  public removeTag(tagName: string): void {
    this.tagListControl.patchValue(this.tagListControl.value.filter(tag => tag !== tagName));
  }
}
