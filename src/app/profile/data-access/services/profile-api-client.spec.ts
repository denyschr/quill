import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfileApiClient } from './profile-api-client';
import { Profile } from '@app/profile/data-access/models';

describe('ProfileApiClient', () => {
  let httpController: HttpTestingController;
  let profileApiClient: ProfileApiClient;

  const mockProfile = { username: 'jack' } as Profile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    httpController = TestBed.inject(HttpTestingController);
    profileApiClient = TestBed.inject(ProfileApiClient);
  });

  afterEach(() => httpController.verify());

  it('should return a profile', () => {
    let actualProfile: Profile | undefined;
    profileApiClient
      .get(mockProfile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    httpController.expectOne(`/profiles/${mockProfile.username}`).flush({ profile: mockProfile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(mockProfile);
  });

  it('should follow a user', () => {
    let actualProfile: Profile | undefined;
    profileApiClient
      .follow(mockProfile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    const mockRequest = httpController.expectOne({
      method: 'POST',
      url: `/profiles/${mockProfile.username}/follow`
    });
    expect(mockRequest.request.body).toBeNull();
    mockRequest.flush({ profile: mockProfile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(mockProfile);
  });

  it('should unfollow a user', () => {
    let actualProfile: Profile | undefined;
    profileApiClient
      .unfollow(mockProfile.username)
      .subscribe(fetchedProfile => (actualProfile = fetchedProfile));

    httpController
      .expectOne({
        method: 'DELETE',
        url: `/profiles/${mockProfile.username}/follow`
      })
      .flush({ profile: mockProfile });

    expect(actualProfile).withContext('The observable should emit the profile').toBe(mockProfile);
  });
});
