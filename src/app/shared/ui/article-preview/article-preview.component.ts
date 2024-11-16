import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '@shared/data-access/models';
import { ArticleMetaComponent } from '@shared/ui/article-meta';
import { TagListComponent } from '@shared/ui/tag-list';
import { FavoriteButtonComponent } from '@shared/ui/favorite-button';

@Component({
  selector: 'ql-article-preview',
  standalone: true,
  template: `
    <div class="shadow p-3 bg-white rounded">
      <ql-article-meta [author]="article.author" [createdAt]="article.createdAt">
        <ql-favorite-button
          [favorited]="article.favorited"
          [slug]="article.slug"
          [favoritesCount]="article.favoritesCount"
          class="ms-auto"
        />
      </ql-article-meta>

      <div class="position-relative">
        <h3 class="fs-4">
          <a class="text-dark hover-underline" [routerLink]="['/article', article.slug]">{{
            article.title
          }}</a>
        </h3>
        <p class="text-secondary">{{ article.description }}</p>
        <div class="position-relative z-2 d-flex justify-content-between">
          <a
            class="preview-more | hover-underline text-body-tertiary"
            [routerLink]="['/article', article.slug]"
            >Read more...</a
          >
          <ql-tag-list [tags]="article.tagList" />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      h3 {
        a::before {
          content: '';
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      .preview-more {
        font-size: 0.8rem;
      }
    `
  ],
  imports: [RouterLink, ArticleMetaComponent, FavoriteButtonComponent, TagListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePreviewComponent {
  @Input({ required: true })
  public article!: Article;
}
