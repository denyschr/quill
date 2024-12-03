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
    }).compileComponents();

    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title and a link to the login page', () => {
    const element = fixture.debugElement;

    const title = element.query(By.css('h1'));
    expect(title)
      .withContext('The template should have an `h1` element to display the title')
      .not.toBeNull();
    expect(title.nativeElement.textContent)
      .withContext('The title should have a text')
      .toContain('Sign up');

    const link = element.query(By.css('a[href="/login"]'));
    expect(link)
      .withContext('The template should have an `a` element to display the link to the login page')
      .not.toBeNull();
    expect(link.nativeElement.textContent)
      .withContext('The link should have a text')
      .toContain('Have an account?');
  });

  it('should use the PasswordInputToggleComponent', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(PasswordInputToggleComponent)))
      .withContext(
        'You probably forgot to add the `PasswordInputToggleComponent` to the `RegisterComponent` template'
      )
      .not.toBeNull();
  });

  it('should have a disabled button if the form is incomplete', () => {
    const element = fixture.debugElement;
    const button = element.query(By.css('button[type="submit"]'));
    expect(button)
      .withContext('The template should have a button to submit the form')
      .not.toBeNull();
    expect(button.nativeElement.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);
  });

  it('should have a disabled button after the form is submitted', () => {
    store.setState({ ...initialState, auth: { ...initialState.auth, submitting: true } });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;
    expect(element.query(By.css('button[type="submit"]')).nativeElement.hasAttribute('disabled'))
      .withContext('The button should be disabled after submitting')
      .toBe(true);
  });

  it('should be possible to register if the form is complete', () => {
    const element = fixture.debugElement;

    const usernameInput = element.query(By.css('input[type="text"]'));
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.nativeElement.value = 'username';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    const emailInput = element.query(By.css('input[type="email"]'));
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.nativeElement.value = 'email@gmail.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    const passwordInput = element.query(By.css('input[type="password"]'));
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.nativeElement.value = '12345678';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(element.query(By.css('button[type="submit"]')).nativeElement.hasAttribute('disabled'))
      .withContext('The button should be enabled if the form is valid')
      .toBe(false);
  });

  it('should display error messages if fields are touched and invalid', () => {
    const element = fixture.debugElement;

    const usernameInput = element.query(By.css('input[type="text"]'));
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.nativeElement.value = 'username';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    usernameInput.nativeElement.dispatchEvent(new Event('blur'));
    usernameInput.nativeElement.value = '';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameRequiredError = element.query(By.css('div.mb-3 div'));
    expect(usernameRequiredError)
      .withContext('You should have an error message if the username field is required and touched')
      .not.toBeNull();
    expect(usernameRequiredError.nativeElement.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username is required');

    usernameInput.nativeElement.value = 'us';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameLengthError = element.query(By.css('div.mb-3 div'));
    expect(usernameLengthError)
      .withContext(
        'You should have an error message if the username field is too short and touched'
      )
      .not.toBeNull();
    expect(usernameLengthError.nativeElement.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username must be at least 3 characters long');

    usernameInput.nativeElement.value = 'username';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailInput = element.query(By.css('input[type="email"]'));
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.nativeElement.value = 'email@gmail.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    emailInput.nativeElement.dispatchEvent(new Event('blur'));
    emailInput.nativeElement.value = '';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailRequiredError = element.query(By.css('div.mb-3 div'));
    expect(emailRequiredError)
      .withContext('You should have an error message if the email field is required and touched')
      .not.toBeNull();
    expect(emailRequiredError.nativeElement.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email is required');

    emailInput.nativeElement.value = 'email.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailError = element.query(By.css('div.mb-3 div'));
    expect(emailError)
      .withContext('You should have an error message if the email field is incorrect and touched')
      .not.toBeNull();
    expect(emailError.nativeElement.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email must be a valid email address');

    emailInput.nativeElement.value = 'email@gmail.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordInput = element.query(By.css('input[type="password"]'));
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.nativeElement.value = '1234';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.dispatchEvent(new Event('blur'));
    passwordInput.nativeElement.value = '';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordRequiredError = element.query(By.css('div.mb-3 div:not(.input-group)'));
    expect(passwordRequiredError)
      .withContext('You should have an error message if the password field is required and touched')
      .not.toBeNull();
    expect(passwordRequiredError.nativeElement.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password is required');

    passwordInput.nativeElement.value = '1234';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordLengthError = element.query(By.css('div.mb-3 div:not(.input-group)'));
    expect(passwordLengthError)
      .withContext(
        'You should have an error message if the password field is too short and touched'
      )
      .not.toBeNull();
    expect(passwordLengthError.nativeElement.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password must be at least 8 characters long');
  });

  it('should dispatch a register action on submit', () => {
    const element = fixture.debugElement;

    const usernameInput = element.query(By.css('input[type="text"]'));
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.nativeElement.value = 'username';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    const emailInput = element.query(By.css('input[type="email"]'));
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.nativeElement.value = 'email@gmail.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    const passwordInput = element.query(By.css('input[type="password"]')).nativeElement;
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.value = '12345678';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.query(By.css('button[type="submit"]')).nativeElement.click();

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
          username: ['has already been taken']
        }
      }
    });
    store.refreshState();
    fixture.detectChanges();

    const element = fixture.debugElement;

    const backendErrors = element.query(By.directive(BackendErrorsComponent));
    expect(backendErrors)
      .withContext('You should have the `BackendErrorsComponent` to display an error message')
      .not.toBeNull();

    const error = element.query(By.css('li'));
    expect(error.nativeElement.textContent)
      .withContext('The backend error message is incorrect')
      .toContain('username has already been taken');
  });
});
