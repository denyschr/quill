import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/auth/data-access/state';
import { filter, map } from 'rxjs';

export interface LoggedInGuardOptions {
  readonly loggedIn: boolean;
  readonly otherwise: string;
}

export const loggedInGuard = (options: LoggedInGuardOptions): CanActivateFn => {
  const { loggedIn, otherwise } = options;
  return () => {
    const router = inject(Router);
    const store = inject(Store);
    return store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== undefined),
      map(currentUser => !!currentUser === loggedIn || router.parseUrl(otherwise))
    );
  };
};
