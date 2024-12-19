import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@shared/data-access/models';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { TagListComponent } from '@shared/ui/tag-list';
import { FavoriteButtonComponent } from '@shared/ui/favorite-button';

@Component({
  selector: 'ql-article-preview',
  template: `
    <div class="p-3 border rounded-1 bg-white">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <a [routerLink]="['/profile', article.author.username]">
            <img
              class="rounded-circle"
              [ngSrc]="article.author.image"
              width="32"
              height="32"
              [alt]="article.author.username"
            />
          </a>
          <div>
            <a
              data-test="author-name"
              class="text-decoration-none"
              [routerLink]="['/profile', article.author.username]"
            >
              {{ article.author.username }}
            </a>
            <p data-test="article-date" class="mb-0 text-muted">
              Published on
              <time [attr.datetime]="article.createdAt">
                {{ article.createdAt | date: 'MMM d, y' }}
              </time>
            </p>
          </div>
        </div>
        <ql-favorite-button
          [favorited]="article.favorited"
          [favoritesCount]="article.favoritesCount"
          [slug]="article.slug"
        />
      </div>
      <h3 class="mb-1">
        <a
          class="fw-normal text-dark text-decoration-none"
          [routerLink]="['/article', article.slug]"
          >{{ article.title }}</a
        >
      </h3>
      <p data-test="article-description" class="text-secondary">{{ article.description }}</p>
      <div class="d-flex justify-content-between align-items-center gap-2">
        <a
          data-test="article-read-more"
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

      h3 a:hover {
        color: var(--bs-primary) !important;
      }
    `
  ],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, DatePipe, FavoriteButtonComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePreviewComponent {
  @Input({ required: true })
  public article!: Article;
}
