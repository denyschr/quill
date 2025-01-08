import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@shared/data-access/models';
import { IconDirective, icons } from '@shared/directives/icon';

@Component({
  selector: 'ql-navbar',
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

            @if (currentUser === null) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Sign up</a>
              </li>
            }

            @if (currentUser) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/editor" routerLinkActive="active">
                  <ql-icon [icon]="icons.edit" />
                  New Article
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/settings" routerLinkActive="active">
                  <ql-icon [icon]="icons.settings" />
                  Settings
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  [routerLink]="['/profile', currentUser.username]"
                  routerLinkActive="active"
                >
                  {{ currentUser.username }}
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgbCollapse, IconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public navbarCollapsed = true;
  public icons = icons;

  @Input({ required: true })
  public currentUser!: User | null;

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
