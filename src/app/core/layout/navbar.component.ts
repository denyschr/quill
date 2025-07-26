import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { combineLatest } from 'rxjs';

import { selectCurrentUser } from '@/app/auth/data-access/state';

@Component({
  selector: 'ql-navbar',
  template: `
    <header class="fixed-top">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container">
          <a data-test="navbar-brand" class="navbar-brand" routerLink="/">Quill</a>
          <button
            data-test="navbar-toggler"
            class="navbar-toggler"
            type="button"
            aria-controls="primary-navbar"
            [attr.aria-expanded]="!navbarCollapsed"
            aria-label="Toggle navigation"
            (click)="toggleNavbar()"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div id="primary-navbar" class="navbar-collapse" [ngbCollapse]="navbarCollapsed">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a
                  data-test="navbar-link"
                  class="nav-link"
                  routerLink="/"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  >Home</a
                >
              </li>

              <ng-container *ngrxLet="vm$; let vm">
                @let currentUser = vm.currentUser;

                @if (currentUser === null) {
                  <li class="nav-item">
                    <a
                      data-test="navbar-link"
                      class="nav-link"
                      routerLink="/login"
                      routerLinkActive="active"
                      >Sign in</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      data-test="navbar-link"
                      class="nav-link"
                      routerLink="/register"
                      routerLinkActive="active"
                      >Sign up</a
                    >
                  </li>
                }

                @if (currentUser) {
                  <li class="nav-item">
                    <a
                      data-test="navbar-link"
                      class="nav-link"
                      routerLink="/editor"
                      routerLinkActive="active"
                    >
                      <span class="bi bi-pencil-square" aria-hidden="true"></span>
                      New Article
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      data-test="navbar-link"
                      class="nav-link"
                      routerLink="/settings"
                      routerLinkActive="active"
                    >
                      <span class="bi bi-gear-wide-connected" aria-hidden="true"></span>
                      Settings
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      data-test="navbar-link"
                      id="current-user"
                      class="nav-link"
                      [routerLink]="['/profile', currentUser.username]"
                      routerLinkActive="active"
                    >
                      {{ currentUser.username }}
                    </a>
                  </li>
                }
              </ng-container>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgbCollapse, LetDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  protected navbarCollapsed = true;
  protected readonly vm$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser)
  });

  constructor(private readonly store: Store) {}

  protected toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
