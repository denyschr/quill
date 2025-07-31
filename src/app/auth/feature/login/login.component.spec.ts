import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { BackendErrorsComponent } from '@/app/shared/ui/backend-errors';

import { LoginFormComponent } from '../../ui/login-form';
import { authActions, authInitialState } from '../../data-access/state';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let store: MockStore;
  const initialState = {
    auth: authInitialState
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
  });

  it('should have a title and a link to the register page', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const title = debugElement.query(By.css('[data-test=login-title]'));
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Sign in');

    const registerLink = debugElement.query(By.css('[data-test=register-link]'));
    expect(registerLink)
      .withContext('You should have an `a` element for the link to the register page')
      .not.toBeNull();
    expect(registerLink.nativeElement.textContent)
      .withContext('The link should have a text')
      .toContain("Don't have an account?");
  });

  it('should dispatch a login action when submitting the form', () => {
    const mockCredentials = { email: 'jack@email.tld', password: '1234' };
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    spyOn(store, 'dispatch');

    const loginForm = fixture.debugElement.query(By.directive(LoginFormComponent));
    expect(loginForm)
      .withContext('You should have LoginFormComponent to display the login form')
      .not.toBeNull();

    loginForm.componentInstance.submitted.emit(mockCredentials);

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.login({ credentials: mockCredentials })
    );
  });

  it('should display backend error messages if login fails', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const debugElement = fixture.debugElement;
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        errors: {
          email: ['already exists'],
          password: ['is invalid']
        }
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const backendErrors = debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = debugElement.queryAll(By.css('[data-test=error-message]'));
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].nativeElement.textContent).toContain('email already exists');
    expect(errors[1].nativeElement.textContent).toContain('password is invalid');
  });
});
