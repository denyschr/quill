import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { profileActions, selectLoading, selectProfile } from '@profile/data-access/state';
import { combineLatest, filter, map } from 'rxjs';
import { selectCurrentUser } from '@auth/data-access/state';
import { LetDirective } from '@ngrx/component';
import { UserInfoComponent } from '@profile/ui/user-info';
import { ArticlesToggleComponent } from '@profile/ui/articles-toggle';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (!vm.loading) {
        @if (vm.profile) {
          @let profile = vm.profile;
          <ql-user-info [profile]="profile" [owner]="vm.owner" />

          <div class="container">
            <div class="row py-4">
              <div class="col-md-10 offset-md-1">
                <ql-articles-toggle [username]="profile.username" />
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
  imports: [LetDirective, UserInfoComponent, ArticlesToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProfileComponent implements OnInit {
  public readonly owner$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser).pipe(filter(Boolean)),
    profile: this.store.select(selectProfile).pipe(filter(Boolean))
  }).pipe(map(({ currentUser, profile }) => currentUser.username === profile.username));

  public readonly vm$ = combineLatest({
    profile: this.store.select(selectProfile),
    loading: this.store.select(selectLoading),
    owner: this.owner$
  });

  @Input()
  public username!: string;

  constructor(private readonly store: Store) {}

  public ngOnInit() {
    this.store.dispatch(profileActions.getProfile({ username: this.username }));
  }
}
