import { TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FormControlValidationDirective } from './form-control-validation.directive';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  template: `
    <form [formGroup]="form">
      <label for="lastName" class="form-label">Name</label>
      <input id="lastName" class="form-control" type="text" formControlName="lastName" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, FormControlValidationDirective]
})
class FormTestComponent {
  public fb = inject(NonNullableFormBuilder);
  public form = this.fb.group({
    lastName: ['', Validators.required]
  });
}

describe('FormControlValidationDirective', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should add the is-invalid CSS class', () => {
    const fixture = TestBed.createComponent(FormTestComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement.query(By.directive(FormControlValidationDirective));
    expect(directive)
      .withContext('The directive should be applied to an element with a class `form-control`')
      .not.toBeNull();

    const lastName = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      '#lastName'
    )!;
    expect(lastName.classList).not.toContain('is-invalid');

    lastName.value = 'Whatever';
    lastName.dispatchEvent(new Event('input'));
    lastName.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(lastName.classList).not.toContain('is-invalid');

    lastName.value = '';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(lastName.classList).toContain('is-invalid');

    lastName.value = 'Whatever';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(lastName.classList).not.toContain('is-invalid');
  });
});
