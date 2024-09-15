import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileModel } from '@shared/data-access/models';

@Component({
  selector: 'ql-article-meta',
  standalone: true,
  template: `
    <div class="d-flex align-items-center mb-1">
      <a class="me-2" [routerLink]="['/profile', author.username]">
        <img class="rounded-circle" [src]="author.image" [alt]="author.username" />
      </a>
      <div class="d-flex flex-column align-items-start">
        <a class="hover-underline link-success" [routerLink]="['/profile', author.username]">
          {{ author.username }}
        </a>
        <time class="article-date text-body-tertiary" [attr.datetime]="createdAt">{{
          createdAt
        }}</time>
      </div>
      <div class="ms-auto">ADD TO FAVORITES</div>
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
