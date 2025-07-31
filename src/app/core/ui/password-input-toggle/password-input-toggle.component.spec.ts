/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { PasswordInputToggleComponent } from './password-input-toggle.component';

@Component({
  template: `
    <form>
      <label>Password</label>
      <input type="password" #passwordInput />
      <ql-password-input-toggle [input]="passwordInput" />
    </form>
  `,
  standalone: true,
  imports: [PasswordInputToggleComponent]
})
class PasswordInputToggleTestComponent {}

describe('PasswordInputToggleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    const tooltipConfig = TestBed.inject(NgbTooltipConfig);
    tooltipConfig.animation = false;
  });

  it('should display a button with a tooltip and an icon', () => {
    const fixture = TestBed.createComponent(PasswordInputToggleTestComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const button = debugElement.query(By.css('[data-test=toggle-password-button]'));
    expect(button).withContext('No `button` element to toggle password visibility').not.toBeNull();

    const tooltip = debugElement.query(By.directive(NgbTooltip));
    expect(tooltip)
      .withContext('The `button` element should use the `ngbTooltip` directive')
      .not.toBeNull();

    const tooltipDirective = tooltip.injector.get(NgbTooltip) as NgbTooltip;
    expect(tooltipDirective.ngbTooltip)
      .withContext('The tooltip should have a text')
      .toBe('Toggle visibility');
    expect(tooltipDirective.placement)
      .withContext('The tooltip should be placed at the bottom')
      .toBe('bottom');

    const icon = debugElement.query(By.css('[data-test=toggle-password-button-icon]'));
    expect(icon).withContext('You should have a `span` element for the icon').not.toBeNull();
  });

  it('should toggle password visibility when clicking the button', () => {
    const fixture = TestBed.createComponent(PasswordInputToggleTestComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    const inputElement = debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.type)
      .withContext('The input should be of type `password` by default')
      .toBe('password');

    const iconElement = debugElement.query(
      By.css('[data-test=toggle-password-button-icon]')
    ).nativeElement;
    expect(iconElement.classList)
      .withContext('The icon should have the `bi-eye-slash` class by default')
      .toContain('bi-eye-slash');

    const button = debugElement.query(By.css('[data-test=toggle-password-button]'));
    button.triggerEventHandler('click');
    fixture.detectChanges();

    expect(inputElement.type)
      .withContext('The input should be of type `text` if toggled once')
      .toBe('text');
    expect(iconElement.classList)
      .withContext('The icon should have the `bi-eye` class if toggled once')
      .toContain('bi-eye');

    button.triggerEventHandler('click');
    fixture.detectChanges();

    expect(inputElement.type)
      .withContext('The input should be of type `password` if toggled twice')
      .toBe('password');
    expect(iconElement.classList)
      .withContext('The icon should have the `bi-eye-slash` class if toggled twice')
      .toContain('bi-eye-slash');
  });
});
