import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { profileFavoritesResolver } from './profile-favorites.resolver';

describe('profileFavoritesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileFavoritesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
