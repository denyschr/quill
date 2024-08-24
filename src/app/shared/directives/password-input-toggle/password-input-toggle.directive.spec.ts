import { Component, DebugElement } from '@angular/core';
import { InputDirective } from '@shared/directives/input';
import { PasswordInputToggleDirective } from './password-input-toggle.directive';
import { IconButtonComponent } from '@shared/ui/icon-button';
import { FormFieldComponent } from '@shared/ui/form-field';
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

describe('PasswordInputToggleDirective', () => {
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
