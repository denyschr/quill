import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/ui/navbar';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { filter } from 'rxjs';

@Component({
  template: `
    <ng-container *ngrxLet="currentUser$; let currentUser">
      <header class="fixed-top">
        <ql-navbar [currentUser]="currentUser" />
      </header>
      <main class="mt-5">
        <router-outlet />
      </main>
    </ng-container>
  `,
  standalone: true,
  imports: [RouterOutlet, LetDirective, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {
  public readonly currentUser$ = this.store
    .select(selectCurrentUser)
    .pipe(filter(currentUser => currentUser !== undefined));

  constructor(private readonly store: Store) {}
}
