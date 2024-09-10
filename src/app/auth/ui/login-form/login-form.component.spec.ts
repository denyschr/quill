/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<ql-login-form [submitting]="submitting" />`,
  imports: [LoginFormComponent]
})
class LoginFormTestComponent {
  public submitting = false;
}

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(LoginFormTestComponent);
    fixture.detectChanges();
  });

  it('should display a form to register', () => {
    const element = fixture.nativeElement as HTMLElement;

    const valErrors = fixture.debugElement.queryAll(By.css('val-errors'));
    expect(valErrors.length)
      .withContext('You should have 2 `ValidationErrorsComponent` displayed')
      .toBe(2);

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled)
      .withContext('Your submit button should NOT be disabled by default')
      .toBeFalsy();

    const email = element.querySelector<HTMLInputElement>('#email')!;
    expect(email).withContext('Your template should have an input for the email').not.toBeNull();

    const password = element.querySelector<HTMLInputElement>('#password')!;
    expect(password)
      .withContext('Your template should have an input for the password')
      .not.toBeNull();

    const passwordInputToggle = fixture.debugElement.query(
      By.directive(PasswordInputToggleComponent)
    );
    expect(passwordInputToggle)
      .withContext(
        'You probably forgot to add `PasswordInputToggleComponent` to the `RegisterFormComponent` template'
      )
      .not.toBeNull();
  });

  it('should emit an event on submit', () => {
    const element = fixture.nativeElement as HTMLElement;

    const loginForm = fixture.debugElement.query(By.directive(LoginFormComponent));
    spyOn(loginForm.componentInstance.submitted, 'emit');

    const email = element.querySelector<HTMLInputElement>('#email')!;
    email.value = 'den@gmail.com';
    email.dispatchEvent(new Event('input'));

    const password = element.querySelector<HTMLInputElement>('#password')!;
    password.value = '12345678';
    password.dispatchEvent(new Event('input'));

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.click();

    expect(loginForm.componentInstance.submitted.emit)
      .withContext('You may have probably forgot to raise the event when the form is submitted')
      .toHaveBeenCalledWith({
        email: 'den@gmail.com',
        password: '12345678'
      });
  });

  it('should not emit an event on submit when form is invalid', () => {
    const element = fixture.nativeElement as HTMLElement;

    const loginForm = fixture.debugElement.query(By.directive(LoginFormComponent));
    spyOn(loginForm.componentInstance.submitted, 'emit');

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.click();

    expect(loginForm.componentInstance.submitted.emit)
      .withContext('You should NOT raise the event when the form is invalid')
      .not.toHaveBeenCalled();
    expect(loginForm.componentInstance.loginForm.touched)
      .withContext('Your form should be marked as touched when the form is invalid')
      .toBeTruthy();
  });

  it('should disable a form while submitting', () => {
    const element = fixture.nativeElement as HTMLElement;
    fixture.componentInstance.submitting = true;
    fixture.detectChanges();

    const formFields = element.querySelector<HTMLFieldSetElement>('#form-fields')!;
    expect(formFields.disabled)
      .withContext('All your form fields should be disabled while submitting')
      .toBeTruthy();

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled)
      .withContext('Your submit button should be disabled while submitting')
      .toBeTruthy();
  });
});
