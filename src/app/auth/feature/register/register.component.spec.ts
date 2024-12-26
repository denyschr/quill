import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';
import { authActions } from '@auth/data-access/state';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';
import RegisterComponent from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;
  const initialState = {
    auth: {
      currentUser: null,
      submitting: false,
      loading: false,
      errors: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]), provideMockStore({ initialState })]
    });

    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title and a link to the login page', () => {
    const element: HTMLElement = fixture.nativeElement;

    const title = element.querySelector('h1')!;
    expect(title).withContext('You need an `h1` element for the title').not.toBeNull();
    expect(title.textContent).withContext('The title should have a text').toContain('Sign up');

    const link = element.querySelector('a[href="/login"]')!;
    expect(link)
      .withContext('You need an `a` element for the link to the login page')
      .not.toBeNull();
    expect(link.textContent)
      .withContext('The link should have a text')
      .toContain('Have an account?');
  });

  it('should use PasswordInputToggleComponent', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(PasswordInputToggleComponent)))
      .withContext('You need `PasswordInputToggleComponent` for toggling password visibility')
      .not.toBeNull();
  });

  it('should have a disabled button if the form is incomplete', () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button[type="submit"]')!;
    expect(button).withContext('You need a `button` element to submit the form').not.toBeNull();
    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);
  });

  it('should have a disabled button after the form is submitted', () => {
    store.setState({ ...initialState, auth: { ...initialState.auth, submitting: true } });
    store.refreshState();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled'))
      .withContext('The button should be disabled after submitting')
      .toBe(true);
  });

  it('should be possible to register if the form is complete', () => {
    const element: HTMLElement = fixture.nativeElement;

    const usernameInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.value = 'username';
    usernameInput.dispatchEvent(new Event('input'));

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You need an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.value = 'email@gmail.com';
    emailInput.dispatchEvent(new Event('input'));

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You need an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.value = '12345678';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled'))
      .withContext('The button should be enabled if the form is valid')
      .toBe(false);
  });

  it('should display error messages if fields are touched and invalid', () => {
    const element: HTMLElement = fixture.nativeElement;

    const usernameInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.value = 'username';
    usernameInput.dispatchEvent(new Event('input'));
    usernameInput.dispatchEvent(new Event('blur'));
    usernameInput.value = '';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameRequiredError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(usernameRequiredError)
      .withContext('You need an error message if the username field is required and touched')
      .not.toBeNull();
    expect(usernameRequiredError.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username is required');

    usernameInput.value = 'us';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameLengthError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(usernameLengthError)
      .withContext('You need an error message if the username field is too short and touched')
      .not.toBeNull();
    expect(usernameLengthError.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username must be at least 3 characters long');

    usernameInput.value = 'username';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You need an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.value = 'email@gmail.com';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailRequiredError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(emailRequiredError)
      .withContext('You need an error message if the email field is required and touched')
      .not.toBeNull();
    expect(emailRequiredError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email is required');

    emailInput.value = 'email.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(emailError)
      .withContext('You need an error message if the email field is incorrect and touched')
      .not.toBeNull();
    expect(emailError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email must be a valid email address');

    emailInput.value = 'email@gmail.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You need an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordRequiredError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(passwordRequiredError)
      .withContext('You need an error message if the password field is required and touched')
      .not.toBeNull();
    expect(passwordRequiredError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password is required');

    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordLengthError = element.querySelector('div.mb-3 .invalid-feedback > div')!;
    expect(passwordLengthError)
      .withContext('You need an error message if the password field is too short and touched')
      .not.toBeNull();
    expect(passwordLengthError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password must be at least 8 characters long');
  });

  it('should dispatch a register action on submit', () => {
    const element: HTMLElement = fixture.nativeElement;

    const usernameInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.value = 'username';
    usernameInput.dispatchEvent(new Event('input'));

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You need an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.value = 'email@gmail.com';
    emailInput.dispatchEvent(new Event('input'));

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You need an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.value = '12345678';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.register({
        credentials: { username: 'username', email: 'email@gmail.com', password: '12345678' }
      })
    );
  });

  it('should display register errors if failed', () => {
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

    const element: HTMLElement = fixture.nativeElement;

    const backendErrors = fixture.debugElement.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You need `BackendErrorsComponent` for error messages')
      .not.toBeNull();

    const errors = element.querySelectorAll('li');
    expect(errors.length).withContext('You need two `li` elements for error messages').toBe(2);
    expect(errors[0].textContent).toContain('email already exists');
    expect(errors[1].textContent).toContain('username has already been taken');
  });
});
