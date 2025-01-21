import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { profileActions } from '@app/profile/data-access/state';

export const profileResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const username = route.paramMap.get('username')!;

  store.dispatch(profileActions.loadProfile({ username }));

  return true;
};
