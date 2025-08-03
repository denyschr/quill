import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ValidationDefaultsComponent } from '@/app/core/validation';
import { PasswordInputToggleComponent } from '@/app/core/ui/password-input-toggle';

import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should display a form to register', () => {
    const fixture = TestBed.createComponent(RegisterFormComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const submitButton = debugElement.query(By.css('[data-test=submit-button]'));
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();
    expect(submitButton.nativeElement.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

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

    usernameInput.nativeElement.value = 'jack';
    usernameInput.triggerEventHandler('input', { target: usernameInput.nativeElement });
    fixture.detectChanges();

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

    emailInput.nativeElement.value = 'jack@email.tld';
    emailInput.triggerEventHandler('input', { target: emailInput.nativeElement });
    fixture.detectChanges();

    const passwordInput = debugElement.query(By.css('[data-test=password-input]'));
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.triggerEventHandler('focus');
    passwordInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const passwordRequiredError = debugElement.query(By.css('.invalid-feedback > *'));
    expect(passwordRequiredError)
      .withContext('You should have an error message if the password field is required and touched')
      .not.toBeNull();
    expect(passwordRequiredError.nativeElement.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password is required');

    passwordInput.nativeElement.value = '1234';
    passwordInput.triggerEventHandler('input', { target: passwordInput.nativeElement });
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

    expect(submitButton.nativeElement.hasAttribute('disabled'))
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

  it('should emit an output event on submit', () => {
    const fixture = TestBed.createComponent(RegisterFormComponent);
    const debugElement = fixture.debugElement;
    const component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.submitted, 'emit');

    const usernameInput = debugElement.query(By.css('[data-test=username-input]'));
    usernameInput.nativeElement.value = 'jack';
    usernameInput.triggerEventHandler('input', { target: usernameInput.nativeElement });

    const emailInput = debugElement.query(By.css('[data-test=email-input]'));
    emailInput.nativeElement.value = 'jack@email.tld';
    emailInput.triggerEventHandler('input', { target: emailInput.nativeElement });

    const passwordInput = debugElement.query(By.css('[data-test=password-input]'));
    passwordInput.nativeElement.value = '12345678';
    passwordInput.triggerEventHandler('input', { target: passwordInput.nativeElement });
    fixture.detectChanges();

    debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');

    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    expect(
      debugElement.query(By.css('[data-test=submit-button]')).nativeElement.hasAttribute('disabled')
    )
      .withContext('Your submit button should be disabled if the form is submitted')
      .toBe(true);
    expect(component.submitted.emit).toHaveBeenCalledWith({
      username: 'jack',
      email: 'jack@email.tld',
      password: '12345678'
    });
  });
});
