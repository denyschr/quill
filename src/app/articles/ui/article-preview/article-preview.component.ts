import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@app/articles/data-access/models';
import { TagListComponent } from '@app/shared/ui/tag-list';
import { ArticleMetaComponent } from '@app/articles/ui/article-meta';

@Component({
  selector: 'ql-article-preview',
  template: `
    <div class="p-3 border rounded-1 bg-white">
      <ql-article-meta class="d-block mb-2" [article]="article">
        <button
          id="toggle-favorite-button"
          type="button"
          class="btn btn-sm flex-shrink-0 ms-auto"
          [class.btn-success]="article.favorited"
          [class.btn-outline-success]="!article.favorited"
          (click)="toggledFavorite.emit()"
        >
          <span class="bi bi-heart-fill"></span>
          {{ article.favoritesCount }}
        </button>
      </ql-article-meta>

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
  styles: `
    .preview-link {
      @media (any-hover: hover) {
        &:hover {
          > h3 {
            color: var(--bs-primary) !important;
          }
        }
      }
    }
  `,
  standalone: true,
  imports: [RouterLink, ArticleMetaComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePreviewComponent {
  @Input({ required: true })
  public article!: Article;

  @Output()
  public readonly toggledFavorite = new EventEmitter<void>();
}
