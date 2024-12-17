import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { articleListActions } from '@articles/data-access/state/article-list';

@Component({
  selector: 'ql-favorite-button',
  template: `
    <button
      type="button"
      class="btn btn-sm"
      [class.btn-danger]="favorited"
      [class.btn-outline-danger]="!favorited"
      (click)="toggleFavorite()"
    >
      <i class="bi bi-heart-fill"></i>
      {{ favoritesCount }}
    </button>
  `,
  standalone: true,
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
