import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as authEffects from './auth.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { authActions } from '@auth/data-access/store/auth.actions';
import { UserModel } from '@shared/data-access/models';
import { JwtService } from '@app/shared/data-access/services';
import { UserService } from '@shared/data-access/api';

describe('AuthEffects', () => {
  const user = { username: 'username' } as UserModel;
  let userService: jasmine.SpyObj<UserService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', [
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
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService }
      ]
    });

    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl');
  });

  describe('getCurrentUser', () => {
    it('should return a getCurrentUserSuccess action with the user information if the token is stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue('token');
      userService.getCurrentUser.and.returnValue(of(user));

      authEffects.getCurrentUser(actions$, userService, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(userService.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a getCurrentUserFailure action if the token is not stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue(null);

      authEffects.getCurrentUser(actions$, userService, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(userService.getCurrentUser).not.toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });
  });

  describe('updateCurrentUser', () => {
    it('should return an updateCurrentUserSuccess action with the updated user information if success', done => {
      actions$ = of(authActions.updateCurrentUser);

      userService.update.and.returnValue(of(user));

      authEffects.updateCurrentUser(actions$, userService).subscribe(action => {
        expect(userService.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });
  });

  describe('register', () => {
    it('should return a registerSuccess action with the user information if success', done => {
      actions$ = of(authActions.register);

      userService.register.and.returnValue(of(user));

      authEffects.register(actions$, userService, jwtService).subscribe(action => {
        expect(jwtService.saveToken).toHaveBeenCalled();
        expect(userService.register).toHaveBeenCalled();
        expect(action).toEqual(authActions.registerSuccess({ currentUser: user }));
        done();
      });
    });
  });

  describe('registerSuccess', () => {
    it('should dispatch a RouterNavigation action', done => {
      actions$ = of(authActions.registerSuccess);

      TestBed.runInInjectionContext(() => {
        authEffects.registerSuccess(actions$).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('login', () => {
    it('should return a loginSuccess action with the user information if success', done => {
      actions$ = of(authActions.login);

      userService.login.and.returnValue(of(user));

      authEffects.login(actions$, userService, jwtService).subscribe(action => {
        expect(jwtService.saveToken).toHaveBeenCalled();
        expect(userService.login).toHaveBeenCalled();
        expect(action).toEqual(authActions.loginSuccess({ currentUser: user }));
        done();
      });
    });
  });

  describe('loginSuccess', () => {
    it('should dispatch a routerNavigation action', done => {
      actions$ = of(authActions.loginSuccess);

      TestBed.runInInjectionContext(() => {
        authEffects.loginSuccess(actions$).subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });

  describe('logout', () => {
    it('should call the jwt service and dispatch a routerNavigation action', done => {
      actions$ = of(authActions.logout);

      TestBed.runInInjectionContext(() => {
        authEffects.logout(actions$).subscribe(() => {
          expect(jwtService.removeToken).toHaveBeenCalled();
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          done();
        });
      });
    });
  });
});
