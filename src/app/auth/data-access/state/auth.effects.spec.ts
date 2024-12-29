import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import * as authEffects from './auth.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { authActions } from './auth.actions';
import { User } from '@shared/data-access/models';
import { UserApiClient } from '@shared/data-access/api';
import { JwtService } from '@shared/data-access/services';

describe('AuthEffects', () => {
  let userClient: jasmine.SpyObj<UserApiClient>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let router: Router;
  let actions$: Observable<unknown>;

  const user = { username: 'username', token: 'token' } as User;
  const errors = {
    email: ['already exists'],
    'email or password': ['is invalid']
  };

  beforeEach(() => {
    userClient = jasmine.createSpyObj<UserApiClient>('UserApiClient', [
      'getCurrentUser',
      'login',
      'register',
      'update'
    ]);
    jwtService = jasmine.createSpyObj<JwtService>('JwtService', [
      'getToken',
      'saveToken',
      'removeToken'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockActions(() => actions$),
        { provide: UserApiClient, useValue: userClient },
        { provide: JwtService, useValue: jwtService }
      ]
    });

    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
  });

  describe('getCurrentUser$', () => {
    it('should return a `getCurrentUserSuccess` action with user information if the token is stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue('token');
      userClient.getCurrentUser.and.returnValue(of(user));

      authEffects.getCurrentUser$(actions$, userClient, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(userClient.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a `getCurrentUserFailure` action if the token is not stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue(null);

      authEffects.getCurrentUser$(actions$, userClient, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(userClient.getCurrentUser).not.toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });

    it('should return a `getCurrentUserFailure` action on failure', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue('token');
      userClient.getCurrentUser.and.returnValue(throwError(() => new Error('error')));

      authEffects.getCurrentUser$(actions$, userClient, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(userClient.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });
  });

  describe('updateCurrentUser$', () => {
    it('should return an `updateCurrentUserSuccess` action with new user information on success', done => {
      actions$ = of(authActions.updateCurrentUser);

      userClient.update.and.returnValue(of(user));

      authEffects.updateCurrentUser$(actions$, userClient).subscribe(action => {
        expect(userClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return an `updateCurrentUserFailure` action with errors on failure', done => {
      actions$ = of(authActions.updateCurrentUser);

      userClient.update.and.returnValue(throwError(() => ({ error: { errors } })));

      authEffects.updateCurrentUser$(actions$, userClient).subscribe(action => {
        expect(userClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserFailure({ errors }));
        done();
      });
    });
  });

  describe('register$', () => {
    it('should return a `registerSuccess` action with user information on success', done => {
      actions$ = of(authActions.register);

      userClient.register.and.returnValue(of(user));

      authEffects.register$(actions$, userClient).subscribe(action => {
        expect(userClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a `registerFailure` action with errors on failure', done => {
      actions$ = of(authActions.register);

      userClient.register.and.returnValue(throwError(() => ({ error: { errors } })));

      authEffects.register$(actions$, userClient).subscribe(action => {
        expect(userClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerFailure({ errors }));
        done();
      });
    });
  });

  describe('login$', () => {
    it('should return a `loginSuccess` action with user information on success', done => {
      actions$ = of(authActions.login);

      userClient.login.and.returnValue(of(user));

      authEffects.login$(actions$, userClient).subscribe(action => {
        expect(userClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a `loginFailure` action with errors on failure', done => {
      actions$ = of(authActions.login);

      userClient.login.and.returnValue(throwError(() => ({ error: { errors } })));

      authEffects.login$(actions$, userClient).subscribe(action => {
        expect(userClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginFailure({ errors }));
        done();
      });
    });
  });

  describe('registerOrLoginSuccess$', () => {
    it('should navigate to the home page on registration success', done => {
      actions$ = of(authActions.registerSuccess({ currentUser: user }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, jwtService).subscribe(() => {
          expect(jwtService.saveToken).toHaveBeenCalledWith('token');
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });

    it('should navigate to the home page on login success', done => {
      actions$ = of(authActions.loginSuccess({ currentUser: user }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, jwtService).subscribe(() => {
          expect(jwtService.saveToken).toHaveBeenCalledWith('token');
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('logout$', () => {
    it('should remove the token and navigate to the home page on logout', done => {
      actions$ = of(authActions.logout);

      TestBed.runInInjectionContext(() => {
        authEffects.logout$(actions$).subscribe(() => {
          expect(jwtService.removeToken).toHaveBeenCalled();
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
