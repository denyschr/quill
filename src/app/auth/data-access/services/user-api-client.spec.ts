import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserApiClient } from './user-api-client';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { User } from '@app/auth/data-access/models';

describe('UserApiClient', () => {
  let httpController: HttpTestingController;
  let userApiClient: UserApiClient;

  const mockUser = { username: 'jack' } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    userApiClient = TestBed.inject(UserApiClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should register a user', () => {
    const mockCredentials = { username: 'jack', email: 'jack@email.tld', password: '1234' };

    let actualUser: User | undefined;
    userApiClient.register(mockCredentials).subscribe(fetchedUser => {
      actualUser = fetchedUser;
    });

    const mockRequest = httpController.expectOne({ method: 'POST', url: '/users' });
    expect(mockRequest.request.body).toEqual({ user: mockCredentials });
    mockRequest.flush({ user: mockUser });

    expect(actualUser).withContext('The observable should emit the user').toBe(mockUser);
  });

  it('should login a user', () => {
    const credentials = { email: 'jack@email.tld', password: '1234' };

    let actualUser: User | undefined;
    userApiClient.login(credentials).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'POST', url: '/users/login' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user: mockUser });

    expect(actualUser).withContext('The observable should emit the user').toBe(mockUser);
  });

  it('should return a user', () => {
    let actualUser: User | undefined;
    userApiClient.getCurrentUser().subscribe(fetchedUser => (actualUser = fetchedUser));

    httpController.expectOne('/user').flush({ user: mockUser });

    expect(actualUser).withContext('The observable should emit the user').toBe(mockUser);
  });

  it('should update a user', () => {
    let actualUser: User | undefined;
    userApiClient
      .update({ username: mockUser.username })
      .subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = httpController.expectOne({ method: 'PUT', url: '/user' });
    expect(req.request.body).toEqual({ user: { username: mockUser.username } });
    req.flush({ user: mockUser });

    expect(actualUser).withContext('The observable should emit the user').toBe(mockUser);
  });
});
