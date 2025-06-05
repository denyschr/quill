import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { JwtTokenStorage, UserApiClient } from '../api';
import { User } from '../models';

import { authActions } from './auth.actions';
import * as authEffects from './auth.effects';

describe('AuthEffects', () => {
  let mockUserApiClient: jasmine.SpyObj<UserApiClient>;
  let mockJwtTokenStorage: jasmine.SpyObj<JwtTokenStorage>;
  let router: Router;
  let actions$: Observable<unknown>;

  const mockUser = { username: 'jack', token: 'token' } as User;
  const mockErrors = {
    email: ['already exists'],
    password: ['is invalid']
  };

  beforeEach(() => {
    mockUserApiClient = jasmine.createSpyObj<UserApiClient>('UserApiClient', [
      'getCurrentUser',
      'login',
      'register',
      'update'
    ]);
    mockJwtTokenStorage = jasmine.createSpyObj<JwtTokenStorage>('JwtTokenStorage', [
      'get',
      'save',
      'remove'
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: UserApiClient, useValue: mockUserApiClient },
        { provide: JwtTokenStorage, useValue: mockJwtTokenStorage }
      ]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  describe('getCurrentUser$', () => {
    it('should return a getCurrentUserSuccess action with a user if the token is stored', done => {
      actions$ = of(authActions.getCurrentUser);

      mockJwtTokenStorage.get.and.returnValue(mockUser.token);
      mockUserApiClient.getCurrentUser.and.returnValue(of(mockUser));

      authEffects
        .getCurrentUser$(actions$, mockUserApiClient, mockJwtTokenStorage)
        .subscribe(action => {
          expect(mockJwtTokenStorage.get).toHaveBeenCalled();
          expect(mockUserApiClient.getCurrentUser).toHaveBeenCalled();
          expect(action).toEqual(authActions.getCurrentUserSuccess({ currentUser: mockUser }));
          done();
        });
    });

    it('should return a getCurrentUserFailure action if the token is not stored', done => {
      actions$ = of(authActions.getCurrentUser);

      mockJwtTokenStorage.get.and.returnValue(null);

      authEffects
        .getCurrentUser$(actions$, mockUserApiClient, mockJwtTokenStorage)
        .subscribe(action => {
          expect(mockJwtTokenStorage.get).toHaveBeenCalled();
          expect(mockUserApiClient.getCurrentUser).not.toHaveBeenCalled();
          expect(action).toEqual(authActions.getCurrentUserFailure());
          done();
        });
    });

    it('should return a getCurrentUserFailure action on failure', done => {
      actions$ = of(authActions.getCurrentUser);

      mockJwtTokenStorage.get.and.returnValue(mockUser.token);
      mockUserApiClient.getCurrentUser.and.returnValue(throwError(() => new Error('error')));

      authEffects
        .getCurrentUser$(actions$, mockUserApiClient, mockJwtTokenStorage)
        .subscribe(action => {
          expect(mockJwtTokenStorage.get).toHaveBeenCalled();
          expect(mockUserApiClient.getCurrentUser).toHaveBeenCalled();
          expect(action).toEqual(authActions.getCurrentUserFailure());
          done();
        });
    });
  });

  describe('updateCurrentUser$', () => {
    it('should return an updateCurrentUserSuccess action with an updated user on success', done => {
      actions$ = of(authActions.updateCurrentUser);

      mockUserApiClient.update.and.returnValue(of(mockUser));

      authEffects.updateCurrentUser$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserSuccess({ currentUser: mockUser }));
        done();
      });
    });

    it('should return an updateCurrentUserFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.updateCurrentUser);

      mockUserApiClient.update.and.returnValue(throwError(() => ({ errors: mockErrors })));

      authEffects.updateCurrentUser$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserFailure({ errors: mockErrors }));
        done();
      });
    });
  });

  describe('updateCurrentUserSuccess$', () => {
    it('should save the token and navigate to the new profile page', done => {
      spyOn(router, 'navigate');

      actions$ = of(authActions.updateCurrentUserSuccess({ currentUser: mockUser }));

      TestBed.runInInjectionContext(() => {
        authEffects
          .updateCurrentUserSuccess$(actions$, router, mockJwtTokenStorage)
          .subscribe(() => {
            expect(mockJwtTokenStorage.save).toHaveBeenCalledWith(mockUser.token);
            expect(router.navigate).toHaveBeenCalledWith(['/profile', mockUser.username]);
            done();
          });
      });
    });
  });

  describe('register$', () => {
    it('should return a registerSuccess action with a user on success', done => {
      actions$ = of(authActions.register);

      mockUserApiClient.register.and.returnValue(of(mockUser));

      authEffects.register$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerSuccess({ currentUser: mockUser }));
        done();
      });
    });

    it('should return a registerFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.register);

      mockUserApiClient.register.and.returnValue(throwError(() => ({ errors: mockErrors })));

      authEffects.register$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerFailure({ errors: mockErrors }));
        done();
      });
    });
  });

  describe('login$', () => {
    it('should return a loginSuccess action with a user on success', done => {
      actions$ = of(authActions.login);

      mockUserApiClient.login.and.returnValue(of(mockUser));

      authEffects.login$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginSuccess({ currentUser: mockUser }));
        done();
      });
    });

    it('should return a loginFailure action with a list of errors on failure', done => {
      actions$ = of(authActions.login);

      mockUserApiClient.login.and.returnValue(throwError(() => ({ errors: mockErrors })));

      authEffects.login$(actions$, mockUserApiClient).subscribe(action => {
        expect(mockUserApiClient.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginFailure({ errors: mockErrors }));
        done();
      });
    });
  });

  describe('registerOrLoginSuccess$', () => {
    it('should save the token and navigate to the home page on registration success', done => {
      actions$ = of(authActions.registerSuccess({ currentUser: mockUser }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, mockJwtTokenStorage).subscribe(() => {
          expect(mockJwtTokenStorage.save).toHaveBeenCalledWith(mockUser.token);
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });

    it('should save the token and navigate to the home page on login success', done => {
      actions$ = of(authActions.loginSuccess({ currentUser: mockUser }));

      TestBed.runInInjectionContext(() => {
        authEffects.registerOrLoginSuccess$(actions$, router, mockJwtTokenStorage).subscribe(() => {
          expect(mockJwtTokenStorage.save).toHaveBeenCalledWith(mockUser.token);
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
          expect(mockJwtTokenStorage.remove).toHaveBeenCalled();
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
