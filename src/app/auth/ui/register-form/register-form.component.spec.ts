import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { By } from '@angular/platform-browser';
import { PasswordInputToggleComponent } from '@shared/ui/password-input-toggle';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a form to register', () => {
    const element = fixture.nativeElement as HTMLElement;

    const valErrors = fixture.debugElement.queryAll(By.css('val-errors'));
    expect(valErrors.length).withContext('You should have 3 `ValidationErrorsComponent` displayed');

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(button.disabled)
      .withContext('Your submit button should NOT be disabled by default')
      .toBeFalsy();

    const username = element.querySelector<HTMLInputElement>('#username')!;
    expect(username)
      .withContext('Your template should have an input for the username')
      .not.toBeNull();

    const usernameValError = valErrors[0].nativeElement as HTMLElement;
    expect(usernameValError.getAttribute('controlName'))
      .withContext('The validation error control name for the username field is incorrect')
      .toBe('username');
    expect(usernameValError.getAttribute('label'))
      .withContext('The validation error label for the username field is incorrect')
      .toBe('The username');

    const email = element.querySelector<HTMLInputElement>('#email')!;
    expect(email).withContext('Your template should have an input for the email').not.toBeNull();

    const emailValError = valErrors[1].nativeElement as HTMLElement;
    expect(emailValError.getAttribute('controlName'))
      .withContext('The validation error control name for the email field is incorrect')
      .toBe('email');
    expect(emailValError.getAttribute('label'))
      .withContext('The validation error label for the email field is incorrect')
      .toBe('The email');

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

    const passwordValError = valErrors[2].nativeElement as HTMLElement;
    expect(passwordValError.getAttribute('controlName'))
      .withContext('The validation error control name for the password field is incorrect')
      .toBe('password');
    expect(passwordValError.getAttribute('label'))
      .withContext('The validation error label for the password field is incorrect')
      .toBe('The password');
  });

  it('should mark input fields as touched on submit if a form is invalid', () => {
    const element = fixture.nativeElement as HTMLElement;

    const button = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.click();
    fixture.detectChanges();

    const username = element.querySelector<HTMLInputElement>('#username')!;
    expect(username.classList)
      .withContext('The username field should be touched')
      .toContain('ng-touched');

    const email = element.querySelector<HTMLInputElement>('#email')!;
    expect(email.classList)
      .withContext('The email field should be touched')
      .toContain('ng-touched');

    const password = element.querySelector<HTMLInputElement>('#password')!;
    expect(password.classList)
      .withContext('The password field should be touched')
      .toContain('ng-touched');
  });

  it('should emit an event on submit', () => {
    const element = fixture.nativeElement as HTMLElement;
    spyOn(component.submitted, 'emit');

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
    fixture.detectChanges();

    expect(component.submitted.emit)
      .withContext('You may have probably forgot to raise the event when the form is submitted')
      .toHaveBeenCalledWith({
        username: 'den',
        email: 'den@gmail.com',
        password: '12345678'
      });
  });
});
