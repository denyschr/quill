import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { authActions, authInitialState } from '@auth/data-access/state';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import { RegisterComponent } from './register.component';
import { getMockedRegisterCredentials } from '../../../testing.spec';
import { RegisterFormComponent } from '@auth/ui/register-form';
import { LoginComponent } from '@auth/feature/login';

describe('RegisterComponent', () => {
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

  it('should have a title and a link to the login page', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const title = element.querySelector('h1')!;
    expect(title).withContext('You should have an `h1` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('Sign up');

    const link = element.querySelector('a[href="/login"]')!;
    expect(link)
      .withContext('You should have an `a` element for the link to the login page')
      .not.toBeNull();
    expect(link.textContent)
      .withContext('The link should have a text')
      .toContain('Have an account?');
  });

  it('should dispatch a `register` action on submit', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const credentials = getMockedRegisterCredentials();
    fixture.detectChanges();

    spyOn(store, 'dispatch');

    const registerForm = fixture.debugElement.query(By.directive(RegisterFormComponent));
    expect(registerForm)
      .withContext('You should have RegisterFormComponent to display a login form')
      .not.toBeNull();

    registerForm.componentInstance.submitted.emit(credentials);

    expect(store.dispatch).toHaveBeenCalledWith(authActions.register({ credentials }));
  });

  it('should display backend error messages if registration fails', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const element: HTMLElement = fixture.nativeElement;
    store.setState({
      ...initialState,
      auth: {
        ...initialState.auth,
        errors: {
          email: ['already exists'],
          username: ['has already been taken']
        }
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have BackendErrorsComponent to display backend error messages')
      .not.toBeNull();

    const errors = element.querySelectorAll('li');
    expect(errors.length)
      .withContext('You should have two `li` elements for error messages')
      .toBe(2);
    expect(errors[0].textContent).toContain('email already exists');
    expect(errors[1].textContent).toContain('username has already been taken');
  });
});
