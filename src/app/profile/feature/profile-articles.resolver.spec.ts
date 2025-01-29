import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { profileArticlesResolver } from './profile-articles.resolver';

describe('profileArticlesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileArticlesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
