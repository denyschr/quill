import { TestBed } from '@angular/core/testing';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

import { BackendErrorsComponent } from './backend-errors.component';

describe('BackendErrorsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    const alertConfig = TestBed.inject(NgbAlertConfig);
    alertConfig.animation = false;
  });

  it('should properly display error messages', () => {
    const fixture = TestBed.createComponent(BackendErrorsComponent);
    fixture.componentInstance.errors = {
      email: ['already exists'],
      password: ['is invalid']
    };
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.directive(NgbAlert));
    expect(alert).withContext('You should have NgbAlert for error messages').not.toBeNull();

    const alertComponent = alert.componentInstance as NgbAlert;
    expect(alertComponent.type).withContext('The alert should be a danger one').toBe('danger');
    expect(alertComponent.dismissible)
      .withContext('The alert should NOT be dismissible')
      .toBe(false);

    const errors = fixture.debugElement.queryAll(By.css('[data-test=error-message]'));
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].nativeElement.textContent).toContain('email already exists');
    expect(errors[1].nativeElement.textContent).toContain('password is invalid');
  });
});
