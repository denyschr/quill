import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserModel } from '@shared/data-access/models';

describe('AuthService', () => {
  let authService: AuthService;
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

    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(authService).toBeTruthy();
  });

  it('should register a user', () => {
    const credentials = {
      username: user.username,
      email: user.email,
      password: '12345678'
    };

    let acutalUser: UserModel | undefined;
    authService.register(credentials).subscribe(fetchedUser => {
      acutalUser = fetchedUser;
    });

    const req = http.expectOne({ method: 'POST', url: '/users' });
    expect(req.request.body).toEqual({
      user: credentials
    });
    req.flush({ user: user });

    expect(acutalUser).withContext('The observable should return the user').toBe(user);
  });

  it('should login a user', () => {
    const credentials = {
      email: user.email,
      password: '12345678'
    };

    let actualUser: UserModel | undefined;
    authService.login(credentials).subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'POST', url: '/users/login' });
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user: user });

    expect(actualUser).withContext('The observable should return the user').toBe(user);
  });

  it('should return a user', () => {
    let actualUser: UserModel | undefined;
    authService.getCurrentUser().subscribe(fetchedUser => (actualUser = fetchedUser));

    const req = http.expectOne({ method: 'GET', url: '/user' });
    req.flush({ user: user });

    expect(actualUser).withContext('The observable should return the user').toBe(user);
  });
});
