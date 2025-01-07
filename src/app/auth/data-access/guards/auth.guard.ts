import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@auth/data-access/state';
import { filter, map } from 'rxjs';

export const authGuard = (options: {
  readonly authenticated: boolean;
  readonly otherwise: string;
}): CanActivateFn => {
  const { authenticated, otherwise } = options;
  return () => {
    const router = inject(Router);
    const store = inject(Store);
    return store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== undefined),
      map(currentUser => !!currentUser === authenticated || router.parseUrl(otherwise))
    );
  };
};
