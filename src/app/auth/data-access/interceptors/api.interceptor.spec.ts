import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { apiInterceptor } from './api.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@environment';

describe('apiInterceptor', () => {
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([apiInterceptor])), provideHttpClientTesting()]
    });

    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => http.verify());

  it('should augment the request with the API URL', () => {
    const apiUrl = `${environment.apiUrl}/api/test`;
    httpClient.get('/test').subscribe();

    const req = http.expectOne(apiUrl);
    expect(req.request.url).toBe(apiUrl);
  });
});
