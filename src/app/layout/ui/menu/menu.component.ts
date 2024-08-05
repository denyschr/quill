import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ql-menu',
  standalone: true,
  template: `
    <header>
      <nav class="navbar navbar-expand-lg shadow-sm bg-white">
        <div class="container">
          <a class="navbar-brand fw-bold text-success" routerLink="/">Quill</a>
          <button type="button" class="navbar-toggler" (click)="toggleNavbar()">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbar" class="navbar-collapse" [class.collapse]="navbarCollapsed">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Sign up</a>
              </li>
            </ul>
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
  imports: [RouterLink, RouterLinkActive],
  providers: []
})
export default class MenuComponent {
  public navbarCollapsed = true;

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
