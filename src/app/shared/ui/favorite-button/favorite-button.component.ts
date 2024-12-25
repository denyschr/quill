import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { articleListActions } from '@articles/data-access/state/article-list';
import { User } from '@shared/data-access/models';
import { selectCurrentUser } from '@auth/data-access/state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'ql-favorite-button',
  template: `
    <button
      data-test="favorite-button"
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
  public favorited = false;

  @Input()
  public favoritesCount = 0;

  @Input()
  public slug = '';

  public authenticated: User | null | undefined;

  constructor(
    private _router: Router,
    private store: Store
  ) {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntilDestroyed())
      .subscribe(user => (this.authenticated = user));
  }

  public toggleFavorite(): void {
    if (!this.authenticated) {
      void this._router.navigateByUrl('/login');
    } else {
      if (this.favorited) {
        --this.favoritesCount;
        this.store.dispatch(articleListActions.unfavorite({ slug: this.slug }));
      } else {
        ++this.favoritesCount;
        this.store.dispatch(articleListActions.favorite({ slug: this.slug }));
      }
      this.favorited = !this.favorited;
    }
  }
}
