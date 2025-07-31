import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { ArticleListComponent } from '@/app/articles/feature/article-list';
import { authInitialState } from '@/app/auth/data-access/state';

import { profileActions, profileInitialState } from '../data-access/state';
import { UserInfoComponent } from '../ui/user-info';
import { ArticleTabsComponent } from '../ui/article-tabs';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  const mockProfile = {
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    following: false
  };

  let store: MockStore;
  const initialState = {
    profile: {
      ...profileInitialState,
      profile: mockProfile
    },
    auth: {
      ...authInitialState,
      currentUser: {
        username: 'jack'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'profile/:username',
            component: ProfileComponent,
            children: [
              {
                path: '',
                component: ArticleListComponent
              },
              {
                path: 'favorites',
                component: ArticleListComponent
              }
            ]
          }
        ]),
        provideMockStore({ initialState })
      ]
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should display a loading message if the status is loading', async () => {
    store.setState({
      ...initialState,
      profile: {
        ...initialState.profile,
        profile: null,
        loading: true
      }
    });
    store.refreshState();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const message = harness.routeDebugElement!.query(By.css('[data-test=loading-profile-message]'));
    expect(message)
      .withContext('You should have a `div` element for a loading message')
      .not.toBeNull();
    expect(message.nativeElement.textContent)
      .withContext('The message should have a text')
      .toContain('Loading profile');
  });

  it('should display user info', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const userInfo = harness.routeDebugElement!.query(By.directive(UserInfoComponent));
    expect(userInfo)
      .withContext('You should use UserInfoComponent to display user info')
      .not.toBeNull();
  });

  it('should display article tabs', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const articleTabs = harness.routeDebugElement!.query(By.directive(ArticleTabsComponent));
    expect(articleTabs)
      .withContext('You should use ArticleTabsComponent to display article tabs')
      .not.toBeNull();
  });

  it('should display a list of articles for /profile/:username and /profile/:username/favorites', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/profile/jack');
    let articleList = harness.routeDebugElement!.query(By.directive(ArticleListComponent));
    expect(articleList)
      .withContext('You should have ArticleListComponent for the /profile/:username route')
      .not.toBeNull();

    await harness.navigateByUrl('/profile/jack/favorites');
    articleList = harness.routeDebugElement!.query(By.directive(ArticleListComponent));
    expect(articleList)
      .withContext(
        'You should have ArticleListComponent for the /profile/:username/favorites route'
      )
      .not.toBeNull();
  });

  it('should allow the user to edit profile settings if the owner', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const userInfo = harness.routeDebugElement!.query(By.directive(UserInfoComponent));
    expect(userInfo.componentInstance.canModify).toBe(true);
  });

  it('should NOT allow the user to edit profile settings if not the owner', async () => {
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: {
          username: 'john'
        }
      }
    });
    store.refreshState();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const userInfo = harness.routeDebugElement!.query(By.directive(UserInfoComponent));
    expect(userInfo.componentInstance.canModify).withContext('Whatever').toBe(false);
  });

  it('should dispatch a follow action when following the user', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const userInfo = harness.routeDebugElement!.query(By.directive(UserInfoComponent));
    userInfo.componentInstance.toggledFollow.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      profileActions.follow({ username: mockProfile.username })
    );
  });

  it('should dispatch an unfollow action when unfollowing the user', async () => {
    store.setState({
      ...initialState,
      profile: {
        ...initialState.profile,
        profile: {
          ...mockProfile,
          following: true
        }
      }
    });
    store.refreshState();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/profile/jack');

    const userInfo = harness.routeDebugElement!.query(By.directive(UserInfoComponent));
    userInfo.componentInstance.toggledFollow.emit();
    expect(store.dispatch).toHaveBeenCalledWith(
      profileActions.unfollow({ username: mockProfile.username })
    );
  });
});
