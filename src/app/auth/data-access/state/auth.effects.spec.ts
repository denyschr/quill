import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import * as authEffects from './auth.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { authActions } from './auth.actions';
import { getMockedUser } from '@app/testing.spec';
import { JwtTokenStorage, UserApiClient } from '@app/auth/data-access/services';
import { BackendErrors } from '@app/core/data-access/models';

describe('AuthEffects', () => {
  let userClient: jasmine.SpyObj<UserApiClient>;
  let jwtTokenStorage: jasmine.SpyObj<JwtTokenStorage>;
  let router: Router;
  let actions$: Observable<unknown>;

  const user = getMockedUser();
  const errors: BackendErrors = {
    email: ['already exists'],
    password: ['is invalid']
  };

  beforeEach(() => {
    userClient = jasmine.createSpyObj<UserApiClient>('UserApiClient', [
      'getCurrentUser',
      'login',
      'register',
      'update'
    ]);
    jwtTokenStorage = jasmine.createSpyObj<JwtTokenStorage>('JwtTokenStorage', [
      'get',
      'save',
      'remove'
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: UserApiClient, useValue: userClient },
        { provide: JwtTokenStorage, useValue: jwtTokenStorage }
      ]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  describe('getCurrentUser$', () => {
    it('should return a getCurrentUserSuccess action with a user if the token is stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtTokenStorage.get.and.returnValue(user.token);
      userClient.getCurrentUser.and.returnValue(of(user));

      authEffects.getCurrentUser$(actions$, userClient, jwtTokenStorage).subscribe(action => {
        expect(jwtTokenStorage.get).toHaveBeenCalled();
        expect(userClient.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a getCurrentUserFailure action if the token is not stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtTokenStorage.get.and.returnValue(null);

      authEffects.getCurrentUser$(actions$, userClient, jwtTokenStorage).subscribe(action => {
        expect(jwtTokenStorage.get).toHaveBeenCalled();
        expect(userClient.getCurrentUser).not.toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });

    it('should return a getCurrentUserFailure action on failure', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtTokenStorage.get.and.returnValue(user.token);
      userClient.getCurrentUser.and.returnValue(throwError(() => new Error('error')));

      authEffects.getCurrentUser$(actions$, userClient, jwtTokenStorage).subscribe(action => {
        expect(jwtTokenStorage.get).toHaveBeenCalled();
        expect(userClient.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });
  });

  describe('updateCurrentUser$', () => {
    it('should return an updateCurrentUserSuccess action with an updated user on success', done => {
      actions$ = of(authActions.updateCurrentUser);

      userClient.update.and.returnValue(of(user));

      authEffects.updateCurrentUser$(actions$, userClient).subscribe(action => {
        expect(userClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return an updateCurrentUserFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.updateCurrentUser);

      userClient.update.and.returnValue(throwError(() => ({ errors })));

      authEffects.updateCurrentUser$(actions$, userClient).subscribe(action => {
        expect(userClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserFailure({ errors }));
        done();
      });
    });
  });

  describe('updateCurrentUserSuccess$', () => {
    it('should save the token and navigate to the new profile page', done => {
      spyOn(router, 'navigate');

      actions$ = of(authActions.updateCurrentUserSuccess({ currentUser: user }));

      TestBed.runInInjectionContext(() => {
        authEffects.updateCurrentUserSuccess$(actions$, router, jwtTokenStorage).subscribe(() => {
          expect(jwtTokenStorage.save).toHaveBeenCalledWith(user.token);
          expect(router.navigate).toHaveBeenCalledWith(['/profile', user.username]);
          done();
        });
      });
    });
  });

  describe('register$', () => {
    it('should return a registerSuccess action with a user on success', done => {
      actions$ = of(authActions.register);

      userClient.register.and.returnValue(of(user));

      authEffects.register$(actions$, userClient).subscribe(action => {
        expect(userClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a registerFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.register);

      userClient.register.and.returnValue(throwError(() => ({ errors })));

      authEffects.register$(actions$, userClient).subscribe(action => {
        expect(userClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerFailure({ errors }));
        done();
      });
    });
  });

  describe('login$', () => {
    it('should return a loginSuccess action with a user on success', done => {
      actions$ = of(authActions.login);

      userClient.login.and.returnValue(of(user));

      authEffects.login$(actions$, userClient).subscribe(action => {
        expect(userClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a loginFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.login);

      userClient.login.and.returnValue(throwError(() => ({ errors })));

      authEffects.login$(actions$, userClient).subscribe(action => {
        expect(userClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginFailure({ errors }));
        done();
      });
    });
  });

  describe('registerOrLoginSuccess$', () => {
    it('should save the token and navigate to the home page on registration success', done => {
      actions$ = of(authActions.registerSuccess({ currentUser: user }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, jwtTokenStorage).subscribe(() => {
          expect(jwtTokenStorage.save).toHaveBeenCalledWith(user.token);
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });

    it('should save the token and navigate to the home page on login success', done => {
      actions$ = of(authActions.loginSuccess({ currentUser: user }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, jwtTokenStorage).subscribe(() => {
          expect(jwtTokenStorage.save).toHaveBeenCalledWith(user.token);
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('logout$', () => {
    it('should remove the token and navigate to the home page', done => {
      actions$ = of(authActions.logout);

      TestBed.runInInjectionContext(() => {
        authEffects.logout$(actions$).subscribe(() => {
          expect(jwtTokenStorage.remove).toHaveBeenCalled();
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
