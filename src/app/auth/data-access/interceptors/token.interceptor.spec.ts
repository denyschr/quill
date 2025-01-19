import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tokenInterceptor } from './token.interceptor';
import { JwtService } from '@shared/data-access/services';

describe('tokenInterceptor', () => {
  let jwtService: jasmine.SpyObj<JwtService>;
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    jwtService = jasmine.createSpyObj<JwtService>('JwtService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: JwtService, useValue: jwtService }
      ]
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpController.verify());

  it('should do nothing if there is no jwt token', () => {
    http.get('/foo').subscribe();

    const req = httpController.expectOne('/foo');
    expect(req.request.headers.get('Authorization')).toBe(null);
  });

  it('should send a jwt token', () => {
    jwtService.getToken.and.returnValue('hello');
    http.get('/foo').subscribe();

    const req = httpController.expectOne('/foo');
    expect(req.request.headers.get('Authorization')).toBe('Token hello');
  });
});
