import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { ProfileApiClient } from '../api';
import { Profile } from '../models';

import * as profileEffects from './profile.effects';
import { profileActions } from './profile.actions';

describe('ProfileEffects', () => {
  let profileApiClient: jasmine.SpyObj<ProfileApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    profileApiClient = jasmine.createSpyObj<ProfileApiClient>('ProfileApiClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: ProfileApiClient, useValue: profileApiClient }
      ]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  describe('loadProfile$', () => {
    it('should return a loadProfileSuccess action with a user profile on success', done => {
      const profile = { username: 'jack' } as Profile;
      actions$ = of(profileActions.loadProfile);

      profileApiClient.get.and.returnValue(of(profile));

      profileEffects.loadProfile$(actions$, profileApiClient).subscribe(action => {
        expect(profileApiClient.get).toHaveBeenCalled();
        expect(action).toEqual(
          profileActions.loadProfileSuccess({
            profile
          })
        );
        done();
      });
    });

    it('should return a loadProfileFailure action on failure', done => {
      actions$ = of(profileActions.loadProfile);

      profileApiClient.get.and.returnValue(throwError(() => new Error('error')));

      profileEffects.loadProfile$(actions$, profileApiClient).subscribe(action => {
        expect(profileApiClient.get).toHaveBeenCalled();
        expect(action).toEqual(profileActions.loadProfileFailure());
        done();
      });
    });
  });

  describe('loadProfileFailure$', () => {
    it('should navigate to the home page on profile loading failure', done => {
      actions$ = of(profileActions.loadProfileFailure);

      TestBed.runInInjectionContext(() => {
        profileEffects.loadProfileFailure$(actions$, router).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
