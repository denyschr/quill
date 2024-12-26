/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="userForm">
      <div class="mb-3">
        <label for="lastName" class="form-label">Name</label>
        <input id="lastName" type="text" class="form-control" formControlName="lastName" />
      </div>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule]
})
class FormTestComponent {
  public fb = inject(NonNullableFormBuilder);
  public userForm = this.fb.group({
    lastName: ['', Validators.required]
  });
}

describe('FormControlValidationDirective', () => {
  let fixture: ComponentFixture<FormTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(FormTestComponent);
    fixture.detectChanges();
  });

  it('should add the is-invalid CSS class', () => {
    const element: HTMLElement = fixture.nativeElement;

    const directive = fixture.debugElement.query(By.directive(FormControlValidationDirective));
    expect(directive)
      .withContext('The directive should be applied to an element with a class `form-control`')
      .not.toBeNull();

    const lastName = element.querySelector<HTMLInputElement>('#lastName')!;
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
