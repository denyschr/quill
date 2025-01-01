import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Article } from '@shared/data-access/models';

@Component({
  selector: 'ql-article-meta',
  template: `
    <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
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
          class="fs-5 link-light text-decoration-none"
          [routerLink]="['/profile', article.author.username]"
        >
          {{ article.author.username }}
        </a>
        <p data-test="article-created-date" class="mb-0 text-white">
          Published on
          <time [attr.datetime]="article.createdAt"
            >{{ article.createdAt | date: 'MMM d, y' }}
          </time>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      p:has(time) {
        font-size: 0.875rem;
      }
    `
  ],
  standalone: true,
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleMetaComponent {
  @Input({ required: true })
  public article!: Article;
}
