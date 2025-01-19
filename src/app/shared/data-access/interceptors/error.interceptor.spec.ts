import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';
import { Router } from '@angular/router';

describe('errorInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
  });

  afterEach(() => httpController.verify());

  it('should return an error and navigate to the login page on 401 response', () => {
    http.get('/foo').subscribe({
      error: (err: string) => {
        expect(err).toBe('Unauthorized');
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      }
    });

    const req = httpController.expectOne('/foo');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should not navigate on non-401 response ', () => {
    http.get('/foo').subscribe({
      error: (err: string) => {
        expect(err).toBe('Server Error');
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      }
    });

    const req = httpController.expectOne('/foo');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
