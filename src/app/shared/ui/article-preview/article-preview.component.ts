import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleModel } from '@shared/data-access/models';
import { ArticleMetaComponent } from '@shared/ui/article-meta';

@Component({
  selector: 'ql-article-preview',
  standalone: true,
  template: `
    <div class="shadow p-3 bg-white rounded">
      <ql-article-meta [author]="article.author" [createdAt]="article.createdAt" />

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
          TAG LIST
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
  imports: [RouterLink, ArticleMetaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePreviewComponent {
  @Input({ required: true })
  public article!: ArticleModel;
}
