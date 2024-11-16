import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '@shared/data-access/models';

@Component({
  selector: 'ql-user-info',
  standalone: true,
  template: `
    <div class="bg-dark-subtle">
      <div class="container py-4">
        <div class="row">
          <div class="text-center col-md-10 offset-md-1">
            <img [src]="'user-avatar.png'" width="120" height="120" [alt]="profile.username" />
            <h1 class="fs-3 fw-bold">{{ profile.username }}</h1>
            @if (profile.bio) {
              <p class="text-secondary">{{ profile.bio }}</p>
            }
            <div>
              <!-- TODO: FOLLOW USER BUTTON -->
              @if (owner) {
                <a class="btn btn-sm btn-outline-secondary" routerLink="/settings"
                  >Edit profile settings</a
                >
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  @Input({ required: true })
  public profile!: Profile;

  @Input()
  public owner = false;
}
