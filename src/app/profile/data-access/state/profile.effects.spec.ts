import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as profileEffects from './profile.effects';
import { provideRouter, Router } from '@angular/router';
import { profileActions } from './profile.actions';
import { ProfileApiClient } from '@app/profile/data-access/services';
import { Profile } from '@app/profile/data-access/models';

describe('ProfileEffects', () => {
  let profileClient: jasmine.SpyObj<ProfileApiClient>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    profileClient = jasmine.createSpyObj<ProfileApiClient>('ProfileApiClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: ProfileApiClient, useValue: profileClient }
      ]
    });

    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
  });

  describe('loadProfile$', () => {
    it('should return a `loadProfileSuccess` action with a user profile on success', done => {
      const profile = { username: 'username' } as Profile;
      actions$ = of(profileActions.loadProfile);

      profileClient.get.and.returnValue(of(profile));

      profileEffects.loadProfile$(actions$, profileClient).subscribe(action => {
        expect(profileClient.get).toHaveBeenCalled();
        expect(action).toEqual(
          profileActions.loadProfileSuccess({
            profile
          })
        );
        done();
      });
    });

    it('should return a `loadProfileFailure` action on failure', done => {
      actions$ = of(profileActions.loadProfile);

      profileClient.get.and.returnValue(throwError(() => new Error('error')));

      profileEffects.loadProfile$(actions$, profileClient).subscribe(action => {
        expect(profileClient.get).toHaveBeenCalled();
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
