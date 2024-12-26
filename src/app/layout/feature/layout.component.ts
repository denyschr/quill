import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'ql-layout',
  template: `
    <ng-container *ngrxLet="currentUser$ as currentUser">
      @if (currentUser !== undefined) {
        <header class="fixed-top">
          <ql-navbar [currentUser]="currentUser" />
        </header>
        <main class="mt-5">
          <router-outlet />
        </main>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [RouterOutlet, LetDirective, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {
  public readonly currentUser$ = this.store.select(selectCurrentUser);

  constructor(private readonly store: Store) {}
}
