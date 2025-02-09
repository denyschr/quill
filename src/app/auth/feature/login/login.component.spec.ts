import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { BackendErrorsComponent } from '@app/shared/ui/backend-errors';
import { LoginFormComponent } from '@app/auth/ui/login-form';
import { authActions, authInitialState } from '@app/auth/data-access/state';

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
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const title = element.querySelector('h1')!;
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('Sign in');

    const link = element.querySelector('a[href="/register"]')!;
    expect(link)
      .withContext('You should have an `a` element for the link to the register page')
      .not.toBeNull();
    expect(link.textContent)
      .withContext('The link should have a text')
      .toContain("Don't have an account?");
  });

  it('should dispatch a login action on submit', () => {
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

    const element: HTMLElement = fixture.nativeElement;
    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = element.querySelectorAll('li')!;
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].textContent).toContain('email already exists');
    expect(errors[1].textContent).toContain('password is invalid');
  });
});
