import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserApiClient } from './user-api-client';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  getMockedLoginCredentials,
  getMockedRegisterCredentials,
  getMockedUser
} from '@app/testing.spec';
import { User } from '@app/auth/data-access/models';

describe('UserApiClient', () => {
  let userClient: UserApiClient;
  let httpController: HttpTestingController;

  const user = getMockedUser();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    userClient = TestBed.inject(UserApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should register a user', () => {
    const credentials = getMockedRegisterCredentials();

    let actualUser: User | undefined;
    userClient.register(credentials).subscribe(fetchedUser => {
      actualUser = fetchedUser;
    });

    const req = httpController.expectOne({ method: 'POST', url: '/users' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user });

    expect(actualUser).withContext('The observable should emit the user').toBe(user);
  });

  it('should login a user', () => {
    const credentials = getMockedLoginCredentials();

    let actualUser: User | undefined;
    userClient.login(credentials).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'POST', url: '/users/login' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user });

    expect(actualUser).withContext('The observable should emit the user').toBe(user);
  });

  it('should return a user', () => {
    let actualUser: User | undefined;
    userClient.getCurrentUser().subscribe(fetchedUser => (actualUser = fetchedUser));

    httpController.expectOne('/user').flush({ user });

    expect(actualUser).withContext('The observable should emit the user').toBe(user);
  });

  it('should update a user', () => {
    const expectedUser = {
      ...user,
      bio: 'I like doing karate'
    };

    let actualUser: User | undefined;
    userClient
      .update({ bio: expectedUser.bio })
      .subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'PUT', url: '/user' });
    expect(req.request.body).toEqual({ user: { bio: expectedUser.bio } });
    req.flush({ user: expectedUser });

    expect(actualUser).withContext('The observable should emit the user').toBe(expectedUser);
  });
});
