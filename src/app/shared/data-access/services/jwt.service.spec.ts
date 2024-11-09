import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let jwtService: JwtService;
  let localStorageGetItem: jasmine.Spy<(key: string) => string | null>;

  beforeEach(() => {
    localStorageGetItem = spyOn(Storage.prototype, 'getItem');
    localStorageGetItem.and.returnValue(null);

    TestBed.configureTestingModule({});

    jwtService = TestBed.inject(JwtService);
  });

  it('should be created', () => {
    expect(jwtService).toBeTruthy();
  });

  it('should return a jwt token if one is stored', () => {
    localStorageGetItem.and.returnValue('token');

    jwtService.getToken();

    expect(localStorageGetItem).toHaveBeenCalledWith('jwtToken');
  });

  it('should return no jwt token if none is stored ', () => {
    const result = jwtService.getToken();
    expect(result).toBeNull();
  });

  it('should save a jwt token', () => {
    spyOn(Storage.prototype, 'setItem');

    jwtService.saveToken('token');

    expect(Storage.prototype.setItem).toHaveBeenCalledWith('jwtToken', 'token');
  });

  it('should remove a jwt token', () => {
    spyOn(Storage.prototype, 'removeItem');

    jwtService.removeToken();

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('jwtToken');
  });
});
