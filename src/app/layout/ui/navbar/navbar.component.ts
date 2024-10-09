import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectCurrentUser } from '@auth/data-access/store';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ql-navbar',
  standalone: true,
  template: `
    <header>
      <nav class="navbar navbar-expand-lg shadow-sm bg-white">
        <div class="container">
          <a class="navbar-brand fw-bold text-success" routerLink="/">Quill</a>
          <button type="button" class="navbar-toggler" (click)="toggleNavbar()">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            id="navbar"
            class="navbar-collapse"
            [class.collapse]="navbarCollapsed"
            *ngrxLet="vm$; let vm"
          >
            @let currentUser = vm.currentUser;

            <!-- Show this if the user is not logged in -->
            @if (currentUser === null) {
              <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                    ngbTooltip="Home"
                    >Home</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/login"
                    routerLinkActive="active"
                    ngbTooltip="Sign in"
                    >Sign in</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/register"
                    routerLinkActive="active"
                    ngbTooltip="Sign up"
                    >Sign up</a
                  >
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
                    ngbTooltip="Home"
                    >Home</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/editor"
                    routerLinkActive="active"
                    ngbTooltip="New Article"
                  >
                    <i class="bi bi-pencil-square"></i>
                    New Article
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    routerLink="/settings"
                    routerLinkActive="active"
                    ngbTooltip="Settings"
                  >
                    <i class="bi bi-gear-wide-connected"></i>
                    Settings
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    [routerLink]="['/profile', currentUser.username]"
                    routerLinkActive="active"
                    [ngbTooltip]="currentUser.username"
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
    </header>
  `,
  styles: [
    `
      .nav-link.active {
        color: var(--bs-nav-link-hover-color);
      }
    `
  ],
  imports: [RouterLink, RouterLinkActive, LetDirective, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public navbarCollapsed = true;
  public readonly vm$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser)
  });

  public constructor(private readonly store: Store) {}

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
