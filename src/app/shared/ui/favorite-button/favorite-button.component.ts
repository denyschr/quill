import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { articleListActions } from '@articles/data-access/store/article-list';

@Component({
  selector: 'ql-favorite-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn btn-sm"
      [ngClass]="{ 'btn-outline-success': !favorited, 'btn-success': favorited }"
      (click)="toggleFavorite()"
    >
      <i class="bi bi-heart-fill"></i>
      {{ favoritesCount }}
    </button>
  `,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteButtonComponent {
  @Input()
  public favorited = true;

  @Input()
  public favoritesCount = 0;

  @Input()
  public slug = '';

  constructor(private store: Store) {}

  public toggleFavorite(): void {
    this.store.dispatch(
      articleListActions.favorite({
        favorited: this.favorited,
        slug: this.slug
      })
    );

    if (this.favorited) {
      this.favoritesCount -= 1;
    } else {
      this.favoritesCount += 1;
    }

    this.favorited = !this.favorited;
  }
}
