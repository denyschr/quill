import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tokenInterceptor } from './token.interceptor';
import { JwtTokenStorage } from '@app/auth/data-access/services';

describe('tokenInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  let mockJwtTokenStorage: jasmine.SpyObj<JwtTokenStorage>;

  beforeEach(() => {
    mockJwtTokenStorage = jasmine.createSpyObj<JwtTokenStorage>('JwtTokenStorage', ['get']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: JwtTokenStorage, useValue: mockJwtTokenStorage }
      ]
    });
    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpController.verify());

  it('should do nothing if there is no jwt token', () => {
    http.get('/foo').subscribe();

    const mockRequest = httpController.expectOne('/foo');
    expect(mockRequest.request.headers.get('Authorization')).toBe(null);
  });

  it('should send a jwt token', () => {
    mockJwtTokenStorage.get.and.returnValue('bar');
    http.get('/foo').subscribe();

    const mockRequest = httpController.expectOne('/foo');
    expect(mockRequest.request.headers.get('Authorization')).toBe('Token bar');
  });
});
