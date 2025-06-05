import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  articleListActions,
  articleListInitialState
} from '@/app/articles/data-access/state/article-list';

import { profileArticlesResolver } from './profile-articles.resolver';

describe('profileArticlesResolver', () => {
  let store: MockStore;
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileArticlesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });
    store = TestBed.inject(MockStore);
  });

  it('should dispatch a setConfig action', () => {
    spyOn(store, 'dispatch');

    const mockUsername = 'jack';
    const mockRoute = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue(mockUsername)
      }
    } as unknown as ActivatedRouteSnapshot;
    const result = executeResolver(mockRoute, {} as RouterStateSnapshot);

    expect(store.dispatch).toHaveBeenCalledWith(
      articleListActions.setConfig({
        config: {
          ...articleListInitialState.config,
          filters: {
            ...articleListInitialState.config.filters,
            author: mockUsername
          }
        }
      })
    );
    expect(result).toBe(true);
  });
});
