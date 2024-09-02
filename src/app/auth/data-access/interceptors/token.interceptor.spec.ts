import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tokenInterceptor } from './token.interceptor';
import { JwtService } from '@shared/data-access/services/jwt';

describe('tokenInterceptor', () => {
  let jwtServiceSpy: jasmine.SpyObj<JwtService>;
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    jwtServiceSpy = jasmine.createSpyObj<JwtService>('JwtService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: JwtService, useValue: jwtServiceSpy }
      ]
    });

    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => http.verify());

  it('should do nothing if no jwt token', () => {
    httpClient.get('/test').subscribe();

    const testRequest = http.expectOne('/test');
    expect(testRequest.request.headers.get('Authorization')).toBe(null);
  });

  it('should send a jwt token', () => {
    const token = 'eyJ1c9VyIj7ImlkIjoz0DV9LCJpYXQmOjE3MjUxMjk1NzEsImV4cCI6MTczMDMxMzU3MX0';

    jwtServiceSpy.getToken.and.returnValue(token);
    httpClient.get('/test').subscribe();

    const testRequest = http.expectOne('/test');
    expect(testRequest.request.headers.get('Authorization')).toBe(`Token ${token}`);
  });
});
