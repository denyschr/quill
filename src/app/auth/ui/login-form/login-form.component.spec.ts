import { TestBed } from '@angular/core/testing';
import { ValidationDefaultsComponent } from '@shared/ui/validation-defaults';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  beforeEach(() => {
    const validationDefaults = TestBed.createComponent(ValidationDefaultsComponent);
    validationDefaults.detectChanges();
  });

  it('should have a disabled button if the form is incomplete or submitted', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector('button[type="submit"]')!;
    expect(button).withContext('The template should have a button').not.toBeNull();
    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);

    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();

    expect(button.hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is submitted')
      .toBe(true);
  });
});
