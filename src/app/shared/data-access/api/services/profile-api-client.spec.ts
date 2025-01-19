import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfileApiClient } from './profile-api-client';
import { Profile } from '@shared/data-access/api/models';
import { getMockedProfile } from '../../../../testing.spec';

describe('ProfileApiClient', () => {
  let profileClient: ProfileApiClient;
  let httpController: HttpTestingController;

  const profile = getMockedProfile();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    profileClient = TestBed.inject(ProfileApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should return a profile', () => {
    let actualProfile: Profile | undefined;
    profileClient
      .get(profile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    httpController.expectOne(`/profiles/${profile.username}`).flush({ profile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(profile);
  });

  it('should follow a user', () => {
    let actualProfile: Profile | undefined;
    profileClient
      .follow(profile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    const req = httpController.expectOne({
      method: 'POST',
      url: `/profiles/${profile.username}/follow`
    });
    expect(req.request.body).toBeNull();
    req.flush({ profile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(profile);
  });

  it('should unfollow a user', () => {
    let actualProfile: Profile | undefined;
    profileClient
      .unfollow(profile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    const req = httpController.expectOne({
      method: 'DELETE',
      url: `/profiles/${profile.username}/follow`
    });
    expect(req.request.body).toBeNull();
    req.flush({ profile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(profile);
  });
});
