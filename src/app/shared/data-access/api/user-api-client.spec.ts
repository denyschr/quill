import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserApiClient } from './user-api-client';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { User } from '@shared/data-access/models';

describe('UserApiClient', () => {
  let userApiClient: UserApiClient;
  let httpController: HttpTestingController;

  const user = {
    username: 'username',
    email: 'email@gmail.com'
  } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    userApiClient = TestBed.inject(UserApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    expect(userApiClient).toBeTruthy();
  });

  it('should register a user', () => {
    const credentials = {
      username: user.username,
      email: user.email,
      password: '12345678'
    };

    let actualUser: User | undefined;
    userApiClient.register(credentials).subscribe(fetchedUser => {
      actualUser = fetchedUser;
    });

    const req = httpController.expectOne({ method: 'POST', url: '/users' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user });

    expect(actualUser)
      .withContext('The `register` method should return a User wrapped in an Observable')
      .toBe(user);
  });

  it('should login a user', () => {
    const credentials = {
      email: user.email,
      password: '12345678'
    };

    let actualUser: User | undefined;
    userApiClient.login(credentials).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'POST', url: '/users/login' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user });

    expect(actualUser)
      .withContext('The `login` method should return a User wrapped in an Observable')
      .toBe(user);
  });

  it('should return a user', () => {
    let actualUser: User | undefined;
    userApiClient.getCurrentUser().subscribe(fetchedUser => (actualUser = fetchedUser));

    httpController.expectOne('/user').flush({ user });

    expect(actualUser)
      .withContext('The `getCurrentUser` method should return a User wrapped in an Observable')
      .toBe(user);
  });

  it('should update a user', () => {
    const expectedUser = {
      ...user,
      bio: 'bio'
    };

    let actualUser: User | undefined;
    userApiClient.update({ bio: 'bio' }).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'PUT', url: '/user' });
    expect(req.request.body).toEqual({ user: { bio: 'bio' } });
    req.flush({ user: expectedUser });

    expect(actualUser)
      .withContext('The `update` method should return a User wrapped in an Observable')
      .toBe(expectedUser);
  });
});
