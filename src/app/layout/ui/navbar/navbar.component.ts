import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@shared/data-access/models';

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

        <div data-test="navbar" class="navbar-collapse" [ngbCollapse]="navbarCollapsed">
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

            <!-- Show this if the user is not logged in -->
            @if (currentUser === null) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Sign up</a>
              </li>
            }

            <!-- Show this if the user is logged in -->
            @if (currentUser) {
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
            }
          </ul>
        </div>
      </div>
    </nav>
  `,
  imports: [RouterLink, RouterLinkActive, NgbCollapse],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public navbarCollapsed = true;

  @Input({ required: true })
  public currentUser!: User | null;

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
