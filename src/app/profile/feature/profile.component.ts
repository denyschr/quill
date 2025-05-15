import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { RouterOutlet } from '@angular/router';
import { selectCurrentUser } from '@app/auth/data-access/state';
import { UserInfoComponent } from '@app/profile/ui/user-info';
import { Profile } from '@app/profile/data-access/models';
import { ArticleTabsComponent } from '@app/profile/ui/article-tabs';
import { profileActions, selectLoading, selectProfile } from '@app/profile/data-access/state';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @let profile = vm.profile;

      @if (!vm.loading) {
        @if (profile) {
          <ql-user-info
            [profile]="profile"
            [canModify]="vm.canModify"
            (toggledFollow)="toggleFollow(profile)"
          />

          <div class="container">
            <div class="row py-4">
              <div class="col-md-10 offset-md-1">
                <ql-article-tabs [username]="profile.username" />
                <router-outlet />
              </div>
            </div>
          </div>
        }
      } @else {
        <div id="loading-profile-message">Loading profile...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, RouterOutlet, UserInfoComponent, ArticleTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly canModify$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
    profile: this.store.select(selectProfile)
  }).pipe(map(({ currentUser, profile }) => currentUser?.username === profile?.username));

  public readonly vm$ = combineLatest({
    profile: this.store.select(selectProfile),
    loading: this.store.select(selectLoading),
    canModify: this.canModify$
  });

  constructor(private readonly store: Store) {}

  public toggleFollow(author: Profile): void {
    if (author.following) {
      this.store.dispatch(profileActions.unfollow({ username: author.username }));
    } else {
      this.store.dispatch(profileActions.follow({ username: author.username }));
    }
  }
}
