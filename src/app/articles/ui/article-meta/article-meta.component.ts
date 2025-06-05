import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Article } from '../../data-access/models';

@Component({
  selector: 'ql-article-meta',
  template: `
    <div class="d-flex flex-wrap align-items-center gap-2">
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
          <p class="mb-0 text-secondary" style="font-size: 0.875rem;">
            Published on
            <time [attr.datetime]="article.createdAt">{{ article.createdAt | date }}</time>
          </p>
        </div>
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
