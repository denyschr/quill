import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectCurrentUser, selectStatus } from '@auth/data-access/store';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ql-navbar',
  standalone: true,
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Quill</a>
        <button type="button" class="navbar-toggler" (click)="toggleNavbar()">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          id="navbar"
          class="navbar-collapse"
          [ngbCollapse]="navbarCollapsed"
          *ngrxLet="vm$; let vm"
        >
          @let currentUser = vm.currentUser;

          <!-- Show this if the user is not logged in -->
          @if (vm.status === 'unauthenticated') {
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Sign up</a>
              </li>
            </ul>
          }

          <!-- Show this if the user is logged in -->
          @if (currentUser) {
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/editor" routerLinkActive="active">
                  <i class="bi bi-pencil-square"></i>
                  New Article
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/settings" routerLinkActive="active">
                  <i class="bi bi-gear-wide-connected"></i>
                  Settings
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  [routerLink]="['/profile', currentUser.username]"
                  routerLinkActive="active"
                >
                  @if (currentUser.image) {
                    <img
                      class="rounded-circle me-1"
                      width="26"
                      height="26"
                      [src]="currentUser.image"
                      [alt]="currentUser.username"
                    />
                  }
                  {{ currentUser.username }}
                </a>
              </li>
            </ul>
          }
        </div>
      </div>
    </nav>
  `,
  imports: [RouterLink, RouterLinkActive, LetDirective, NgbCollapse],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public navbarCollapsed = true;
  public readonly vm$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
    status: this.store.select(selectStatus)
  });

  constructor(private readonly store: Store) {}

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
