import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserApiClient } from './user-api-client';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserModel } from '@shared/data-access/models';

describe('UserApiClient', () => {
  let userApiClient: UserApiClient;
  let http: HttpTestingController;

  const user = {
    email: 'denys@gmail.com',
    token: 'eyJ1c9VyIj7ImlkIjoz0DV9LCJpYXQmOjE3MjUxMjk1NzEsImV4cCI6MTczMDMxMzU3MX0',
    username: 'denys',
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    userApiClient = TestBed.inject(UserApiClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(userApiClient).toBeTruthy();
  });

  it('should register a user', () => {
    const credentials = {
      username: user.username,
      email: user.email,
      password: '12345678'
    };

    let acutalUser: UserModel | undefined;
    userApiClient.register(credentials).subscribe(fetchedUser => {
      acutalUser = fetchedUser;
    });

    const req = http.expectOne({ method: 'POST', url: '/users' });
    expect(req.request.body).toEqual({
      user: credentials
    });
    req.flush({ user: user });

    expect(acutalUser).withContext('The observable should emit the registered user').toBe(user);
  });

  it('should login a user', () => {
    const credentials = {
      email: user.email,
      password: '12345678'
    };

    let actualUser: UserModel | undefined;
    userApiClient.login(credentials).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'POST', url: '/users/login' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user: user });

    expect(actualUser).withContext('The observable should emit the logged in user').toBe(user);
  });

  it('should return a user', () => {
    let actualUser: UserModel | undefined;
    userApiClient.getCurrentUser().subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'GET', url: '/user' });
    req.flush({ user: user });

    expect(actualUser).withContext('The observable should emit the user').toBe(user);
  });
});
