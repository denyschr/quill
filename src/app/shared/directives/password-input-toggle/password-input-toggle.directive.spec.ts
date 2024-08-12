import { Component, DebugElement } from '@angular/core';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { InputDirective } from '../input/input.directive';
import { PasswordInputToggleDirective } from './password-input-toggle.directive';
import { IconButtonComponent } from '../../ui/icon-button/icon-button.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `
    <form>
      <ql-form-field>
        <label>Password</label>
        <input qlInput type="password" />
        <button type="button" qlPasswordInputToggle qlIconButton></button>
      </ql-form-field>
    </form>
  `,
  imports: [InputDirective, PasswordInputToggleDirective, IconButtonComponent, FormFieldComponent]
})
class TestFormFieldComponent {}

describe('PasswordInputToggle', () => {
  let fixture: ComponentFixture<TestFormFieldComponent>;
  let button: IconButtonComponent;
  let input: InputDirective;
  let toggle: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(TestFormFieldComponent);
    fixture.detectChanges();

    toggle = fixture.debugElement.query(By.directive(PasswordInputToggleDirective));
    button = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
    const formField: FormFieldComponent = fixture.debugElement.query(
      By.directive(FormFieldComponent)
    ).componentInstance;
    input = formField.input!;
  });

  it('should create', () => {
    expect(button).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should toggle the password visibility', () => {
    expect(button.icon).withContext('The icon should have the class `bi-eye`').toBe('bi-eye');
    expect(input.type).withContext('The input should have the type `password`').toBe('password');

    toggle.triggerEventHandler('click');

    expect(button.icon)
      .withContext('The icon should have the class `bi-eye-slash` after click')
      .toBe('bi-eye-slash');
    expect(input.type)
      .withContext('The input should have the type `text` after click')
      .toBe('text');
  });
});
