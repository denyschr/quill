import { TestBed } from '@angular/core/testing';
import { JwtTokenStorage } from './jwt-token-storage';

describe('JwtTokenStorage', () => {
  let jwtTokenStorage: JwtTokenStorage;
  let localStorageGetItem: jasmine.Spy<(key: string) => string | null>;

  beforeEach(() => {
    localStorageGetItem = spyOn(Storage.prototype, 'getItem');
    localStorageGetItem.and.returnValue(null);

    TestBed.configureTestingModule({});

    jwtTokenStorage = TestBed.inject(JwtTokenStorage);
  });

  it('should return a jwt token if one is stored', () => {
    localStorageGetItem.and.returnValue('token');

    jwtTokenStorage.get();

    expect(localStorageGetItem).toHaveBeenCalledWith('jwtToken');
  });

  it('should return no jwt token if none is stored ', () => {
    const result = jwtTokenStorage.get();
    expect(result).toBeNull();
  });

  it('should save a jwt token', () => {
    spyOn(Storage.prototype, 'setItem');

    jwtTokenStorage.save('token');

    expect(Storage.prototype.setItem).toHaveBeenCalledWith('jwtToken', 'token');
  });

  it('should remove a jwt token', () => {
    spyOn(Storage.prototype, 'removeItem');

    jwtTokenStorage.remove();

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('jwtToken');
  });
});
