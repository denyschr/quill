/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<ql-register-form [submitting]="submitting" />`,
  imports: [RegisterFormComponent]
})
class RegisterFormTestComponent {
  public submitting = false;
}

describe('RegisterFormComponent', () => {
  let fixture: ComponentFixture<RegisterFormTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(RegisterFormTestComponent);
    fixture.detectChanges();
  });

  it('should display a form to register', () => {
    const element = fixture.nativeElement as HTMLElement;

    const valErrors = fixture.debugElement.queryAll(By.css('val-errors'));
    expect(valErrors.length)
      .withContext('You should have 3 `ValidationErrorsComponent` displayed')
      .toBe(3);

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled)
      .withContext('Your submit button should NOT be disabled by default')
      .toBeFalsy();

    const username = element.querySelector<HTMLInputElement>('#username')!;
    expect(username)
      .withContext('Your template should have an input for the username')
      .not.toBeNull();

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

    const registerForm = fixture.debugElement.query(By.directive(RegisterFormComponent));
    spyOn(registerForm.componentInstance.submitted, 'emit');

    const username = element.querySelector<HTMLInputElement>('#username')!;
    username.value = 'den';
    username.dispatchEvent(new Event('input'));

    const email = element.querySelector<HTMLInputElement>('#email')!;
    email.value = 'den@gmail.com';
    email.dispatchEvent(new Event('input'));

    const password = element.querySelector<HTMLInputElement>('#password')!;
    password.value = '12345678';
    password.dispatchEvent(new Event('input'));

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.click();

    expect(registerForm.componentInstance.submitted.emit)
      .withContext('You may have probably forgot to raise the event when the form is submitted')
      .toHaveBeenCalledWith({
        username: 'den',
        email: 'den@gmail.com',
        password: '12345678'
      });
  });

  it('should not emit an event on submit when form is invalid', () => {
    const element = fixture.nativeElement as HTMLElement;

    const registerForm = fixture.debugElement.query(By.directive(RegisterFormComponent));
    spyOn(registerForm.componentInstance.submitted, 'emit');

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.click();

    expect(registerForm.componentInstance.submitted.emit)
      .withContext('You should NOT raise the event when the form is invalid')
      .not.toHaveBeenCalled();
    expect(registerForm.componentInstance.registerForm.touched)
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
