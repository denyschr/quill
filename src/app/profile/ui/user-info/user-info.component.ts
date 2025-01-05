import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '@shared/data-access/models';

@Component({
  selector: 'ql-user-info',
  template: `
    <div class="bg-body-secondary">
      <div class="container py-4">
        <div class="d-flex justify-content-end column-gap-2">
          @if (owner) {
            <a class="btn btn-sm btn-outline-secondary" routerLink="/settings"
              >Edit profile settings</a
            >
          } @else {
            TODO: FOLLOW USER BUTTON
          }
        </div>
        <div class="col-md-10 offset-md-1 text-center">
          <img [src]="profile.image" width="120" height="120" [alt]="profile.username" />
          <h1>{{ profile.username }}</h1>
          <p class="text-body-tertiary">{{ profile.bio }}</p>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  @Input({ required: true })
  public profile!: Profile;

  @Input()
  public owner = false;
}
