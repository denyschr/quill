import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import SettingsComponent from './settings.component';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';
import { authActions } from '@auth/data-access/state';
import { BackendErrorsComponent } from '@shared/ui/backend-errors';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: MockStore;
  const initialState = {
    settings: {
      submitting: false,
      errors: null
    },
    auth: {
      currentUser: {
        email: 'email@gmail.com',
        username: 'username',
        bio: '',
        image: ''
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideMockStore({ initialState })]
    });

    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    const element: HTMLElement = fixture.nativeElement;
    const title = element.querySelector('h1')!;
    expect(title).withContext('You need an `h1` element for the title').not.toBeNull();
    expect(title.textContent)
      .withContext('The title should have a text')
      .toContain('Your Settings');
  });

  it('should use PasswordInputToggleComponent', () => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(PasswordInputToggleComponent)))
      .withContext('You need `PasswordInputToggleComponent` for toggling password visibility')
      .not.toBeNull();
  });

  it('should have a disabled button if the form is incomplete or has a submitting status', () => {
    const element: HTMLElement = fixture.nativeElement;

    const button = element.querySelector('button[type="submit"]')!;
    expect(button).withContext('You need a `button` element to submit the form').not.toBeNull();
    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);

    store.setState({
      ...initialState,
      settings: {
        ...initialState.settings,
        submitting: true
      }
    });
    store.refreshState();
    fixture.detectChanges();

    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled on submit')
      .toBe(true);
  });

  it('should be possible to update settings if the form is complete', () => {
    const element: HTMLElement = fixture.nativeElement;

    const imageInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(imageInput)
      .withContext('You need an input with the type `text` for the image')
      .not.toBeNull();
    expect(imageInput.value).withContext('The initial value of the input is not correct').toBe('');

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    expect(usernameInput.value)
      .withContext('The initial value of the input is not correct')
      .toBe('username');

    const bioInput = element.querySelector('textarea')!;
    expect(bioInput).withContext('You need a textarea for the bio').not.toBeNull();
    expect(bioInput.getAttribute('rows'))
      .withContext('The `rows` attribute of the textarea is not correct')
      .toBe('8');
    expect(bioInput.value).withContext('The initial value of the textarea is not correct').toBe('');

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You need an input with the type `email` for the email')
      .not.toBeNull();
    expect(emailInput.value)
      .withContext('The initial value of the input is not correct')
      .toBe('email@gmail.com');

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

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.value = '';
    usernameInput.dispatchEvent(new Event('input'));
    usernameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const usernameRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(usernameRequiredError)
      .withContext('You need an error message if the username field is required and touched')
      .not.toBeNull();
    expect(usernameRequiredError.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username is required');

    usernameInput.value = 'us';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameLengthError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
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
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const emailRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(emailRequiredError)
      .withContext('You need an error message if the email field is required and touched')
      .not.toBeNull();
    expect(emailRequiredError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email is required');

    emailInput.value = 'email.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(emailError)
      .withContext('You need an error message if the email field is invalid and touched')
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
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const passwordRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(passwordRequiredError)
      .withContext('You need an error message if the password field is required and touched')
      .not.toBeNull();
    expect(passwordRequiredError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password is required');

    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordLengthError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(passwordLengthError)
      .withContext('You need an error message if the password field is too short and touched')
      .not.toBeNull();
    expect(passwordLengthError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password must be at least 8 characters long');
  });

  it('should dispatch an updateCurrentUser action on submit', () => {
    const element: HTMLElement = fixture.nativeElement;
    const updatedSettings = {
      image: 'new image',
      username: 'new username',
      bio: 'new bio',
      email: 'newemail@gmail.com',
      password: '12345678'
    };

    const imageInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(imageInput)
      .withContext('You need an input with the type `text` for the image')
      .not.toBeNull();
    imageInput.value = updatedSettings.image;
    imageInput.dispatchEvent(new Event('input'));

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1]!;
    expect(usernameInput)
      .withContext('You need an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.value = updatedSettings.username;
    usernameInput.dispatchEvent(new Event('input'));

    const bioInput = element.querySelector('textarea')!;
    expect(bioInput).withContext('You need a textarea for the bio').not.toBeNull();
    bioInput.value = updatedSettings.bio;
    bioInput.dispatchEvent(new Event('input'));

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You need an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.value = updatedSettings.email;
    emailInput.dispatchEvent(new Event('input'));

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You need an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.value = updatedSettings.password;
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.updateCurrentUser({ user: updatedSettings })
    );
  });

  it('should display backend errors on settings update failure', () => {
    store.setState({
      ...initialState,
      settings: {
        ...initialState.settings,
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

  it('should dispatch a logout action on logout', () => {
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector<HTMLButtonElement>('button.btn-outline-danger')!;
    expect(button).withContext('You need a `button` element to logout the user').not.toBeNull();

    button.click();
    expect(store.dispatch).toHaveBeenCalledWith(authActions.logout());
  });
});
