import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { apiInterceptor } from './api.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@environment';

describe('apiInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([apiInterceptor])), provideHttpClientTesting()]
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpController.verify());

  it('should make a request with the apiUrl', () => {
    const apiUrl = `${environment.apiUrl}/api/foo`;
    http.get('/foo').subscribe();

    const req = httpController.expectOne(apiUrl);
    expect(req.request.url).toBe(apiUrl);
  });
});
