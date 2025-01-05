import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@shared/data-access/models';
import { DatePipe } from '@angular/common';
import { TagListComponent } from '@shared/ui/tag-list';

@Component({
  selector: 'ql-article-preview',
  template: `
    <div data-test="article-preview" class="p-3 border rounded-1 bg-white">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <a data-test="article-author-image" [routerLink]="['/profile', article.author.username]">
            <img
              class="rounded-circle"
              [src]="article.author.image"
              width="32"
              height="32"
              [alt]="article.author.username"
            />
          </a>
          <div>
            <a
              data-test="article-author-name"
              class="text-decoration-none"
              [routerLink]="['/profile', article.author.username]"
            >
              {{ article.author.username }}
            </a>
            <p data-test="article-created-date" class="mb-0 text-muted">
              Published on
              <time [attr.datetime]="article.createdAt">{{
                article.createdAt | date: 'MMM d, y'
              }}</time>
            </p>
          </div>
        </div>
        <button
          data-test="favorite-button"
          type="button"
          class="btn btn-sm"
          [class.btn-success]="article.favorited"
          [class.btn-outline-success]="!article.favorited"
          (click)="toggleFavorite()"
        >
          <i class="bi bi-heart-fill"></i>
          {{ article.favoritesCount }}
        </button>
      </div>
      <h3 data-test="article-title" class="mb-1">
        <a
          class="fw-normal text-dark text-decoration-none"
          [routerLink]="['/article', article.slug]"
          >{{ article.title }}</a
        >
      </h3>
      <p data-test="article-description" class="text-secondary">{{ article.description }}</p>
      <div class="d-flex justify-content-between align-items-center gap-2">
        <a
          data-test="article-details-link"
          class="btn btn-primary flex-shrink-0"
          [routerLink]="['/article', article.slug]"
          >Read more</a
        >
        @if (article.tagList.length) {
          <ql-tag-list [tags]="article.tagList" />
        }
      </div>
    </div>
  `,
  styles: [
    `
      p:has(time) {
        font-size: 0.875rem;
      }

      h3 > a:hover {
        color: var(--bs-primary) !important;
      }
    `
  ],
  standalone: true,
  imports: [RouterLink, DatePipe, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePreviewComponent {
  @Input({ required: true })
  public article!: Article;

  @Output()
  public readonly favorited = new EventEmitter<string>();

  @Output()
  public readonly unfavorited = new EventEmitter<string>();

  public toggleFavorite(): void {
    if (this.article.favorited) {
      this.unfavorited.emit(this.article.slug);
    } else {
      this.favorited.emit(this.article.slug);
    }
  }
}
