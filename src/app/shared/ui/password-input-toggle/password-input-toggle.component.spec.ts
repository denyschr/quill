/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputToggleComponent } from './password-input-toggle.component';
import { Component } from '@angular/core';
import { IconButtonComponent } from '../icon-button';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `
    <form>
      <label>Password</label>
      <input type="password" #inputElement />
      <ql-password-input-toggle [input]="inputElement" />
    </form>
  `,
  imports: [PasswordInputToggleComponent, IconButtonComponent]
})
class TestPasswordInputToggleComponent {}

describe('PasswordInputToggleComponent', () => {
  let fixture: ComponentFixture<TestPasswordInputToggleComponent>;
  let iconButton: IconButtonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(TestPasswordInputToggleComponent);
    fixture.detectChanges();

    iconButton = fixture.debugElement.query(By.directive(IconButtonComponent)).componentInstance;
  });

  it('should toggle password visibility', () => {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector<HTMLInputElement>('input')!;
    expect(input.type).withContext('The input should have the type `password`').toBe('password');
    expect(iconButton.icon).withContext('The icon should have the class `bi-eye`').toBe('bi-eye');

    const button = element.querySelector<HTMLButtonElement>('button')!;
    expect(button)
      .withContext('You should have a button for handling password visibility')
      .not.toBeNull();
    button.click();
    fixture.detectChanges();

    expect(input.type)
      .withContext('The input should have the type `text` after click')
      .toBe('text');
    expect(iconButton.icon)
      .withContext('The icon should have the class `bi-eye-slash` after click')
      .toBe('bi-eye-slash');
  });
});
