import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { apiInterceptor } from './api.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@env/environment.development';

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

  it('should make a request with the api url', () => {
    const url = `${environment.apiUrl}/api/foo`;
    http.get('/foo').subscribe();

    const req = httpController.expectOne(url);
    expect(req.request.url).toBe(url);
  });
});
