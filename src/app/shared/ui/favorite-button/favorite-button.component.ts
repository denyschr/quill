import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

  public toggleFavorite(): void {
    if (this.favorited) {
      this.favoritesCount -= 1;
    } else {
      this.favoritesCount += 1;
    }
    this.favorited = !this.favorited;
  }
}
