import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '@auth/data-access/services';
import * as authEffects from './auth.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { JwtService } from '@shared/data-access/services/jwt';
import { authActions } from '@auth/data-access/store/auth.actions';
import { UserModel } from '@shared/data-access/models';

describe('AuthEffects', () => {
  const user = { username: 'username' } as UserModel;
  let authService: jasmine.SpyObj<AuthService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let router: Router;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
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
        { provide: AuthService, useValue: authService },
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
      authService.getCurrentUser.and.returnValue(of(user));

      authEffects.getCurrentUser(actions$, authService, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(authService.getCurrentUser).toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });

    it('should return a getCurrentUserFailure action if the token is not stored', done => {
      actions$ = of(authActions.getCurrentUser);

      jwtService.getToken.and.returnValue(null);

      authEffects.getCurrentUser(actions$, authService, jwtService).subscribe(action => {
        expect(jwtService.getToken).toHaveBeenCalled();
        expect(authService.getCurrentUser).not.toHaveBeenCalled();
        expect(action).toEqual(authActions.getCurrentUserFailure());
        done();
      });
    });
  });

  describe('updateCurrentUser', () => {
    it('should return an updateCurrentUserSuccess action with the updated user information if success', done => {
      actions$ = of(authActions.updateCurrentUser);

      authService.update.and.returnValue(of(user));

      authEffects.updateCurrentUser(actions$, authService).subscribe(action => {
        expect(authService.update).toHaveBeenCalled();
        expect(action).toEqual(authActions.updateCurrentUserSuccess({ currentUser: user }));
        done();
      });
    });
  });

  describe('register', () => {
    it('should return a registerSuccess action with the user information if success', done => {
      actions$ = of(authActions.register);

      authService.register.and.returnValue(of(user));

      authEffects.register(actions$, authService, jwtService).subscribe(action => {
        expect(jwtService.saveToken).toHaveBeenCalled();
        expect(authService.register).toHaveBeenCalled();
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

      authService.login.and.returnValue(of(user));

      authEffects.login(actions$, authService, jwtService).subscribe(action => {
        expect(jwtService.saveToken).toHaveBeenCalled();
        expect(authService.login).toHaveBeenCalled();
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
