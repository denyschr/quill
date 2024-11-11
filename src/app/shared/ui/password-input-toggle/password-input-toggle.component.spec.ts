/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputToggleComponent } from './password-input-toggle.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { IconButtonComponent } from '@shared/ui/icon-button';

@Component({
  standalone: true,
  template: `
    <form>
      <label>Password</label>
      <input type="password" #inputElement />
      <ql-password-input-toggle [input]="inputElement" />
    </form>
  `,
  imports: [PasswordInputToggleComponent]
})
class PasswordInputToggleTestComponent {}

describe('PasswordInputToggleComponent', () => {
  let fixture: ComponentFixture<PasswordInputToggleTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // turn off the animation for the tooltip
    const tooltipConfig = TestBed.inject(NgbTooltipConfig);
    tooltipConfig.animation = false;

    fixture = TestBed.createComponent(PasswordInputToggleTestComponent);
    fixture.detectChanges();
  });

  it('should display a button with a tooltip and icon', () => {
    const element = fixture.debugElement;

    const button = element.query(By.css('button'));
    expect(button).withContext('No `button` element to toggle the password').not.toBeNull();

    const tooltip = element.query(By.directive(NgbTooltip));
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

    const iconButton = element.query(By.directive(IconButtonComponent));
    expect(iconButton)
      .withContext(
        'You should have the `IconButtonComponent` inside the `button` element to display an icon'
      )
      .not.toBeNull();
  });

  it('should toggle password visibility on click', () => {
    const element = fixture.debugElement;

    const input = element.query(By.css('input'));
    expect(input.nativeElement.type)
      .withContext('The input should be of type `password` by default')
      .toBe('password');

    const iconButtonComponent = element.query(By.directive(IconButtonComponent))
      .componentInstance as IconButtonComponent;
    expect(iconButtonComponent.icon).withContext(
      'The icon should have the `bi-eye-slash` class by default'
    );

    const button = element.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(input.nativeElement.type)
      .withContext('The input should be of type `text` if toggled')
      .toBe('text');
    expect(iconButtonComponent.icon)
      .withContext('The icon should have the `bi-eye` class if toggled')
      .toContain('bi-eye');

    button.nativeElement.click();
    fixture.detectChanges();

    expect(input.nativeElement.type)
      .withContext('The input should be of type `password` if toggled twice')
      .toBe('password');
    expect(iconButtonComponent.icon)
      .withContext('The icon should have the `bi-eye-slash` class if toggled twice')
      .toContain('bi-eye-slash');
  });
});
