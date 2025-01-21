import { TestBed } from '@angular/core/testing';
import { ValidationDefaultsComponent } from '@app/shared/ui/validation-defaults';
import { LoginFormComponent } from './login-form.component';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@app/shared/ui/password-input-toggle';
import { getMockedLoginCredentials } from '@app/testing.spec';

describe('LoginFormComponent', () => {
  const credentials = getMockedLoginCredentials();

  beforeEach(() => {
    TestBed.configureTestingModule({});

    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should display a form to log in', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    const submitButton = element.querySelector('button[type="submit"]')!;
    expect(submitButton).withContext('You should have a button to submit the form').not.toBeNull();
    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is invalid')
      .toBe(true);

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

    emailInput.value = 'jack.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emailError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(emailError)
      .withContext('You should have an error message if the email field is invalid and touched')
      .not.toBeNull();
    expect(emailError.textContent)
      .withContext('The error message for the email field is incorrect')
      .toContain('The email must be a valid email address');

    emailInput.value = credentials.email;
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    expect(passwordInput)
      .withContext('You should have an input with the type `password` for the password')
      .not.toBeNull();
    passwordInput.dispatchEvent(new Event('focus'));
    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const passwordRequiredError = element.querySelector('div.mb-3 > .invalid-feedback > div')!;
    expect(passwordRequiredError)
      .withContext('You should have an error message if the password field is required and touched')
      .not.toBeNull();
    expect(passwordRequiredError.textContent)
      .withContext('The error message for the password field is incorrect')
      .toContain('The password is required');

    passwordInput.value = 'jack12';
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

    passwordInput.value = credentials.password;
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should NOT be disabled if the form is valid')
      .toBe(false);

    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    expect(submitButton.hasAttribute('disabled'))
      .withContext('Your submit button should be disabled if the form is submitted')
      .toBe(true);
  });

  it('should use PasswordInputToggleComponent', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PasswordInputToggleComponent)))
      .withContext('You should have PasswordInputToggleComponent to toggle password visibility')
      .not.toBeNull();
  });

  it('should emit an event on submit', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    spyOn(fixture.componentInstance.submitted, 'emit');

    const emailInput = element.querySelector<HTMLInputElement>('input[type="email"]')!;
    emailInput.value = credentials.email;
    emailInput.dispatchEvent(new Event('input'));

    const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]')!;
    passwordInput.value = credentials.password;
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(fixture.componentInstance.submitted.emit).toHaveBeenCalledWith(credentials);
  });
});
