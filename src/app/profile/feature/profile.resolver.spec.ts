import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { profileActions } from '@app/profile/data-access/state';
import { profileResolver } from './profile.resolver';

describe('profileResolver', () => {
  let store: MockStore;
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });
    store = TestBed.inject(MockStore);
  });

  it('should dispatch a loadProfile action', () => {
    spyOn(store, 'dispatch');

    const mockUsername = 'jack';
    const mockRoute = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue(mockUsername)
      }
    } as unknown as ActivatedRouteSnapshot;
    const result = executeResolver(mockRoute, {} as RouterStateSnapshot);

    expect(store.dispatch).toHaveBeenCalledWith(
      profileActions.loadProfile({ username: mockUsername })
    );
    expect(result).toBe(true);
  });
});
