import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ValidationDefaultsComponent } from '@/app/core/validation';
import { PasswordInputToggleComponent } from '@/app/core/ui/password-input-toggle';
import { User } from '@/app/auth/data-access/models';

import { SettingsFormComponent } from './settings-form.component';

describe('SettingsFormComponent', () => {
  const mockUser = {
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    username: 'jack',
    bio: 'I work at a state farm',
    email: 'jack@email.tld'
  } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should display a form to update settings', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const submitButton = debugElement.query(By.css('[data-test=submit-button]'));
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();

    const submitButtonElement = submitButton.nativeElement;
    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is NOT dirty')
      .toBe(true);

    const imageUrlInput = debugElement.query(By.css('[data-test=image-url-input]'));
    expect(imageUrlInput)
      .withContext('You should have an input with the type `text` for the image URL')
      .not.toBeNull();

    const usernameInput = debugElement.query(By.css('[data-test=username-input]'));
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    usernameInput.triggerEventHandler('focus');
    usernameInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const usernameRequiredError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(usernameRequiredError)
      .withContext('You should have an error message if the username field is required and touched')
      .not.toBeNull();
    expect(usernameRequiredError.nativeElement.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username is required');

    usernameInput.nativeElement.value = 'ja';
    usernameInput.triggerEventHandler('input', { target: usernameInput.nativeElement });
    fixture.detectChanges();

    const usernameLengthError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(usernameLengthError)
      .withContext(
        'You should have an error message if the username field is too short and touched'
      )
      .not.toBeNull();
    expect(usernameLengthError.nativeElement.textContent)
      .withContext('The error message for the username field is incorrect')
      .toContain('The username must be at least 3 characters long');

    usernameInput.nativeElement.value = mockUser.username;
    usernameInput.triggerEventHandler('input', { target: usernameInput.nativeElement });
    fixture.detectChanges();

    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

    const bioInput = debugElement.query(By.css('[data-test=bio-input]'));
    expect(bioInput).withContext('You should have a textarea for the bio').not.toBeNull();

    const emailInput = debugElement.query(By.css('[data-test=email-input]'));
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    emailInput.triggerEventHandler('focus');
    emailInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const emailRequiredError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(emailRequiredError)
      .withContext('You should have an error message if the email field is required and touched')
      .not.toBeNull();
    expect(emailRequiredError.nativeElement.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email is required');

    emailInput.nativeElement.value = 'jack.tld';
    emailInput.triggerEventHandler('input', { target: emailInput.nativeElement });
    fixture.detectChanges();

    const emailError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(emailError)
      .withContext('You should have an error message if the email field is invalid and touched')
      .not.toBeNull();
    expect(emailError.nativeElement.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email must be a valid email address');

    emailInput.nativeElement.value = mockUser.email;
    emailInput.triggerEventHandler('input', { target: emailInput.nativeElement });
    fixture.detectChanges();

    const passwordInput = debugElement.query(By.css('[data-test=password-input]'));
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.nativeElement.value = '1234';
    passwordInput.triggerEventHandler('input', { target: passwordInput.nativeElement });
    passwordInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const passwordLengthError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(passwordLengthError)
      .withContext(
        'You should have an error message if the password field is too short and touched'
      )
      .not.toBeNull();
    expect(passwordLengthError.nativeElement.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password must be at least 8 characters long');

    passwordInput.nativeElement.value = '12345678';
    passwordInput.triggerEventHandler('input', { target: passwordInput.nativeElement });
    fixture.detectChanges();

    expect(submitButtonElement.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid and dirty')
      .toBe(false);
  });

  it('should use PasswordInputToggleComponent', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PasswordInputToggleComponent)))
      .withContext('You should have PasswordInputToggleComponent to toggle password visibility')
      .not.toBeNull();
  });

  it('should populate a form with user data if provided', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    const debugElement = fixture.debugElement;
    fixture.componentInstance.user = mockUser;
    fixture.detectChanges();

    const imageUrlInput = debugElement.query(By.css('[data-test=image-url-input]'));
    expect(imageUrlInput)
      .withContext('You should have an input with the type `text` for the image URL')
      .not.toBeNull();
    expect(imageUrlInput.nativeElement.value)
      .withContext('The value of the image URL field is not correct')
      .toBe(mockUser.image);

    const usernameInput = debugElement.query(By.css('[data-test=username-input]'));
    expect(usernameInput)
      .withContext('You should have an input with the type `text` for the username')
      .not.toBeNull();
    expect(usernameInput.nativeElement.value)
      .withContext('The value of the username field is not correct')
      .toBe(mockUser.username);

    const bioInput = debugElement.query(By.css('[data-test=bio-input]'));
    expect(bioInput).withContext('You should have a textarea for the bio').not.toBeNull();
    expect(bioInput.nativeElement.value)
      .withContext('The value of the bio field is not correct')
      .toBe(mockUser.bio);

    const emailInput = debugElement.query(By.css('[data-test=email-input]'));
    expect(emailInput)
      .withContext('You should have an input with the type `email` for the email')
      .not.toBeNull();
    expect(emailInput.nativeElement.value)
      .withContext('The value of the email field is not correct')
      .toBe(mockUser.email);

    expect(
      debugElement.query(By.css('[data-test=submit-button]')).nativeElement.hasAttribute('disabled')
    )
      .withContext('Your submit button should be disabled if the form is NOT dirty')
      .toBe(true);
  });

  it('should have a disabled submit button if submitting is set to true', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    fixture.componentInstance.submitting = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement
        .query(By.css('[data-test=submit-button]'))
        .nativeElement.hasAttribute('disabled')
    ).toBe(true);
  });

  it('should emit an output event on submit ', () => {
    const fixture = TestBed.createComponent(SettingsFormComponent);
    const debugElement = fixture.debugElement;
    const component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.submitted, 'emit');

    const imageUrlInput = debugElement.query(By.css('[data-test=image-url-input]'));
    imageUrlInput.nativeElement.value = mockUser.image;
    imageUrlInput.triggerEventHandler('input', { target: imageUrlInput.nativeElement });

    const usernameInput = debugElement.query(By.css('[data-test=username-input]'));
    usernameInput.nativeElement.value = mockUser.username;
    usernameInput.triggerEventHandler('input', { target: usernameInput.nativeElement });

    const bioInput = debugElement.query(By.css('[data-test=bio-input]'));
    bioInput.nativeElement.value = mockUser.bio;
    bioInput.triggerEventHandler('input', { target: bioInput.nativeElement });

    const emailInput = debugElement.query(By.css('[data-test=email-input]'));
    emailInput.nativeElement.value = mockUser.email;
    emailInput.triggerEventHandler('input', { target: emailInput.nativeElement });
    fixture.detectChanges();

    const form = debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit');

    expect(component.submitted.emit).toHaveBeenCalledWith(mockUser);

    const passwordInput = debugElement.query(By.css('[data-test=password-input]'));
    const mockPassword = '12345678';
    passwordInput.nativeElement.value = mockPassword;
    passwordInput.triggerEventHandler('input', { target: passwordInput.nativeElement });
    fixture.detectChanges();

    form.triggerEventHandler('ngSubmit');

    expect(component.submitted.emit).toHaveBeenCalledWith({ ...mockUser, password: mockPassword });
  });
});
