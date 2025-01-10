import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfileApiClient } from './profile-api-client';
import { Profile } from '@shared/data-access/api/models';

describe('ProfileApiClient', () => {
  let profileClient: ProfileApiClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    profileClient = TestBed.inject(ProfileApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    expect(profileClient).toBeTruthy();
  });

  it('should return a profile', () => {
    const expectedProfile = {
      username: 'username'
    } as Profile;

    let actualProfile: Profile | undefined;
    profileClient.get(expectedProfile.username).subscribe(profile => (actualProfile = profile));

    httpController
      .expectOne(`/profiles/${expectedProfile.username}`)
      .flush({ profile: expectedProfile });

    expect(actualProfile)
      .withContext('The `get` method should return a Profile object wrapped in an Observable')
      .toBe(expectedProfile);
  });
});
