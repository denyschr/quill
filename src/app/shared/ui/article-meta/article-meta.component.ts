import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileModel } from '@shared/data-access/models';

@Component({
  selector: 'ql-article-meta',
  standalone: true,
  template: `
    <div class="d-flex flex-wrap align-items-center row-gap-2 column-gap-3 mb-1">
      <a [routerLink]="['/profile', author.username]">
        <img
          class="rounded-circle"
          [src]="author.image"
          width="32"
          height="32"
          [alt]="author.username"
        />
      </a>

      <div class="d-flex flex-column align-items-start">
        <a class="hover-underline link-success" [routerLink]="['/profile', author.username]">
          {{ author.username }}
        </a>
        <time class="article-date | text-secondary" [attr.datetime]="createdAt">{{
          createdAt
        }}</time>
      </div>

      <ng-content />
    </div>
  `,
  styles: [
    `
      .article-date {
        font-size: 0.8rem;
      }
    `
  ],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleMetaComponent {
  @Input({ required: true })
  public author!: ProfileModel;

  @Input({ required: true })
  public createdAt!: string;
}
