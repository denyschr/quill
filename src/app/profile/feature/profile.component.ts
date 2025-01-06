import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { profileActions, selectLoading, selectProfile } from '@profile/data-access/state';
import { combineLatest, filter, map } from 'rxjs';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { UserInfoComponent } from '@profile/ui/user-info';
import { ArticlesToggleComponent } from '@profile/ui/articles-toggle';
import { RouterOutlet } from '@angular/router';
import { Profile } from '@shared/data-access/models';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (!vm.loading) {
        @if (vm.profile) {
          @let profile = vm.profile;
          <ql-user-info
            [profile]="profile"
            [owner]="vm.owner"
            (toggledFollow)="toggleFollow(profile)"
          />

          <div class="container">
            <div class="row py-4">
              <div class="col-md-10 offset-md-1">
                <ql-articles-toggle [username]="profile.username" />
                <router-outlet />
              </div>
            </div>
          </div>
        }
      } @else {
        <div data-test="profile-loading">Loading profile...</div>
      }
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, RouterOutlet, UserInfoComponent, ArticlesToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProfileComponent {
  public readonly owner$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser).pipe(filter(Boolean)),
    profile: this.store.select(selectProfile).pipe(filter(Boolean))
  }).pipe(map(({ currentUser, profile }) => currentUser.username === profile.username));

  public readonly vm$ = combineLatest({
    profile: this.store.select(selectProfile),
    loading: this.store.select(selectLoading),
    owner: this.owner$
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
