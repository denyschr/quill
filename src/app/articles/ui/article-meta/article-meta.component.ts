import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Article } from '../../data-access/models';

@Component({
  selector: 'ql-article-meta',
  template: `
    <div class="d-flex flex-wrap align-items-center gap-2">
      <a data-test="author-avatar-link" [routerLink]="['/profile', article.author.username]">
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
          data-test="author-name"
          class="text-decoration-none"
          [routerLink]="['/profile', article.author.username]"
        >
          {{ article.author.username }}
        </a>
        <p
          data-test="article-creation-date"
          class="mb-0 text-secondary"
          style="font-size: 0.875rem;"
        >
          Published on
          <time [attr.datetime]="article.createdAt">{{ article.createdAt | date }}</time>
        </p>
      </div>
      <ng-content />
    </div>
  `,
  standalone: true,
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleMetaComponent {
  @Input({ required: true })
  public article!: Article;
}
