import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { profileActions } from '@profile/data-access/state';

export const profileResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const username = route.paramMap.get('username')!;
  const store = inject(Store);

  store.dispatch(profileActions.loadProfile({ username }));

  return true;
};
