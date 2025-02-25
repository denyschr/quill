import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { articleDetailResolver } from './article-detail.resolver';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { articleDetailActions } from '@app/articles/data-access/state/article-detail';

describe('articleDetailResolver', () => {
  let store: MockStore;
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => articleDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });
    store = TestBed.inject(MockStore);
  });

  it('should dispatch a loadArticle action', () => {
    spyOn(store, 'dispatch');

    const mockSlug = 'foo';
    const mockRoute = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue(mockSlug)
      }
    } as unknown as ActivatedRouteSnapshot;
    const result = executeResolver(mockRoute, {} as RouterStateSnapshot);

    expect(store.dispatch).toHaveBeenCalledWith(
      articleDetailActions.loadArticle({ slug: mockSlug })
    );
    expect(result).toBe(true);
  });
});
