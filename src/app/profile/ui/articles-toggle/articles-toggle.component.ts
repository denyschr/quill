import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ql-articles-toggle',
  template: `
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          class="nav-link"
          [routerLink]="['/profile', username]"
          routerLinkActive="active pe-none"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          My Articles
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          [routerLink]="['/profile', username, 'favorites']"
          routerLinkActive="active pe-none"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          Favorited Articles
        </a>
      </li>
    </ul>
  `,
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesToggleComponent {
  @Input({ required: true })
  public username!: string;
}
