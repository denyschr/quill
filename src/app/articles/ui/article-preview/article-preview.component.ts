import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@app/articles/data-access/models';
import { DatePipe } from '@angular/common';
import { TagListComponent } from '@app/shared/ui/tag-list';

@Component({
  selector: 'ql-article-preview',
  template: `
    <div class="p-3 border rounded-1 bg-white">
      <div
        class="article-meta | d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2"
      >
        <div class="d-flex align-items-center gap-2">
          <a [routerLink]="['/profile', article.author.username]">
            <img
              class="rounded-circle"
              [src]="article.author.image"
              width="32"
              height="32"
              [alt]="article.author.username"
            />
          </a>
          <div class="article-info">
            <a class="text-decoration-none" [routerLink]="['/profile', article.author.username]">
              {{ article.author.username }}
            </a>
            <p class="mb-0 text-muted">
              Published on
              <time [attr.datetime]="article.createdAt">{{
                article.createdAt | date: 'MMM d, y'
              }}</time>
            </p>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-sm flex-shrink-0"
          [class.btn-success]="article.favorited"
          [class.btn-outline-success]="!article.favorited"
          (click)="toggledFavorite.emit()"
        >
          <span class="bi bi-heart-fill"></span>
          {{ article.favoritesCount }}
        </button>
      </div>
      <a class="preview-link | text-decoration-none" [routerLink]="['/article', article.slug]">
        <h3 class="mb-1 fw-normal text-dark ">{{ article.title }}</h3>
        <p class="text-secondary">{{ article.description }}</p>
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span class="btn btn-primary flex-shrink-0">Read more</span>
          @if (article.tagList.length) {
            <ql-tag-list [tags]="article.tagList" />
          }
        </div>
      </a>
    </div>
  `,
  styles: [
    `
      .article-info > p {
        font-size: 0.875rem;
      }

      .preview-link:hover > h3 {
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
  public readonly toggledFavorite = new EventEmitter<void>();
}
