import { TestBed } from '@angular/core/testing';
import { ValidationDefaultsComponent } from '@app/core/validation';
import { SettingsFormComponent } from '@app/settings/ui/settings-form/settings-form.component';
import { RegisterFormComponent } from '@app/auth/ui/register-form';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@app/core/ui/password-input-toggle';

describe('SettingsFormComponent', () => {
  const mockUser = {
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    username: 'jack',
    bio: 'I work at a state farm',
    email: 'jack@email.tld'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should display a form to update settings', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const submitButton = element.querySelector('button[type="submit"]')!;
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();
    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

    const imageUrlInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(imageUrlInput)
      .withContext('You should have an input with the type `text` for the image URL')
      .not.toBeNull();

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1];
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.dispatchEvent(new Event('focus'));
    usernameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const usernameRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(usernameRequiredError)
      .withContext('You should have an error message if the username field is required and touched')
      .not.toBeNull();
    expect(usernameRequiredError.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username is required');

    usernameInput.value = 'ja';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const usernameLengthError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(usernameLengthError)
      .withContext(
        'You should have an error message if the username field is too short and touched'
      )
      .not.toBeNull();
    expect(usernameLengthError.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username must be at least 3 characters long');

    usernameInput.value = mockUser.username;
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const bioInput = element.querySelector('textarea')!;
    expect(bioInput).withContext('You should have a textarea for the bio').not.toBeNull();
    expect(bioInput.rows)
      .withContext('The `rows` attribute of the bio field is not correct')
      .toBe(8);

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.dispatchEvent(new Event('focus'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const emailRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(emailRequiredError)
      .withContext('You should have an error message if the email field is required and touched')
      .not.toBeNull();
    expect(emailRequiredError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email is required');

    emailInput.value = 'jack.tld';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(emailError)
      .withContext('You should have an error message if the email field is invalid and touched')
      .not.toBeNull();
    expect(emailError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email must be a valid email address');

    emailInput.value = mockUser.email;
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.dispatchEvent(new Event('focus'));
    passwordInput.dispatchEvent(new Event('blur'));
    passwordInput.value = '1234';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordLengthError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(passwordLengthError)
      .withContext(
        'You should have an error message if the password field is too short and touched'
      )
      .not.toBeNull();
    expect(passwordLengthError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password must be at least 8 characters long');

    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);
  });

  it('should use PasswordInputToggleComponent', () => {
    const fixture = TestBed.createComponent(RegisterFormComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PasswordInputToggleComponent)))
      .withContext('You should have PasswordInputToggleComponent to toggle password visibility')
      .not.toBeNull();
  });

  it('should populate a form with user data if provided', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const imageUrlInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(imageUrlInput)
      .withContext('You should have an input with the type `text` for the image URL')
      .not.toBeNull();
    expect(imageUrlInput.value)
      .withContext('The value of the image URL field is not correct')
      .toBe(mockUser.image);

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1];
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    expect(usernameInput.value)
      .withContext('The value of the username field is not correct')
      .toBe(mockUser.username);

    const bioInput = element.querySelector('textarea')!;
    expect(bioInput).withContext('You should have a textarea for the bio').not.toBeNull();
    expect(bioInput.value)
      .withContext('The value of the bio field is not correct')
      .toBe(mockUser.bio);

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    expect(emailInput.value)
      .withContext('The value of the email field is not correct')
      .toBe(mockUser.email);

    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);
  });

  it('should have a disabled submit button if submitting is set to true', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('button[type="submit"]')!.hasAttribute('disabled')).toBe(true);
  });

  it('should emit an output event on submit ', () => {
    const mockPassword = '12345678';
    const fixture = TestBed.createComponent(SettingsFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.submitted, 'emit');

    const element: HTMLElement = fixture.nativeElement;
    const imageUrlInput = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    imageUrlInput.value = mockUser.image;
    imageUrlInput.dispatchEvent(new Event('input'));

    const usernameInput = element.querySelectorAll<HTMLInputElement>('input[type="text"]')[1];
    usernameInput.value = mockUser.username;
    usernameInput.dispatchEvent(new Event('input'));

    const bioInput = element.querySelector('textarea')!;
    bioInput.value = mockUser.bio;
    bioInput.dispatchEvent(new Event('input'));

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    emailInput.value = mockUser.email;
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitButton = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    submitButton.click();

    expect(component.submitted.emit).toHaveBeenCalledWith(mockUser);

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    passwordInput.value = mockPassword;
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitButton.click();

    expect(component.submitted.emit).toHaveBeenCalledWith({ ...mockUser, password: mockPassword });
  });
});
