import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Article } from '@shared/data-access/models';

@Component({
  selector: 'ql-article-meta',
  template: `
    <div class="d-flex flex-wrap align-items-center column-gap-4 row-gap-2">
      <div class="d-flex align-items-center gap-2">
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

      <div class="d-flex align-self-end align-items-center gap-2">
        @if (canModify) {
          <a class="btn btn-sm btn-secondary" [routerLink]="['/editor', article.slug]">
            <i class="bi bi-pencil-square"></i>
            Edit
          </a>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            [disabled]="deleting"
            (click)="deleteArticle()"
          >
            <i class="bi bi-trash3"></i>
            Delete
          </button>
        } @else {
          <button
            data-test="follow-button"
            type="button"
            class="btn btn-sm"
            [class.btn-secondary]="article.author.following"
            [class.btn-outline-secondary]="!article.author.following"
            (click)="toggledFollow.emit()"
          >
            <i class="bi bi-plus-lg"></i>
            {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
          </button>
          <button
            data-test="favorite-button"
            type="button"
            class="btn btn-sm"
            [class.btn-success]="article.favorited"
            [class.btn-outline-success]="!article.favorited"
            (click)="toggledFavorite.emit()"
          >
            <i class="bi bi-heart-fill"></i>
            {{ article.favorited ? 'Remove from Favorites' : 'Add to Favorites' }}
            ({{ article.favoritesCount }})
          </button>
        }
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
  public deleting = false;

  @Input({ required: true })
  public article!: Article;

  @Input()
  public canModify = false;

  @Output()
  public readonly toggledFollow = new EventEmitter<void>();

  @Output()
  public readonly toggledFavorite = new EventEmitter<void>();

  @Output()
  public readonly deleted = new EventEmitter<string>();

  public deleteArticle(): void {
    this.deleting = true;
    this.deleted.emit(this.article.slug);
  }
}
