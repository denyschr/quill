import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { authInitialState } from '../data-access/state';

import { loggedInGuard, LoggedInGuardOptions } from './logged-in.guard';

describe('loggedInGuard', () => {
  let store: MockStore;
  const initialState = {
    auth: authInitialState
  };

  const executeGuard = (options: LoggedInGuardOptions) =>
    TestBed.runInInjectionContext(() =>
      loggedInGuard(options)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ) as Observable<boolean | UrlTree>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
  });

  it('should allow activation if the user is logged in', done => {
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: { username: 'jack' }
      }
    });
    store.refreshState();

    executeGuard({ loggedIn: true, otherwise: '/login' }).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should forbid activation if the user is not logged in, and navigate to the provided page', done => {
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        currentUser: null
      }
    });
    store.refreshState();

    const router = TestBed.inject(Router);
    const urlTree = router.parseUrl('/login');

    executeGuard({ loggedIn: true, otherwise: '/login' }).subscribe(result => {
      expect(result).toEqual(urlTree);
      done();
    });
  });
});
