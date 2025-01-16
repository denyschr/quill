import { TestBed } from '@angular/core/testing';
import { BackendErrorsComponent } from './backend-errors.component';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('BackendErrorsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    // turn off the animation for the alert
    const alertConfig = TestBed.inject(NgbAlertConfig);
    alertConfig.animation = false;
  });

  it('should properly display error messages', () => {
    const fixture = TestBed.createComponent(BackendErrorsComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('errors', {
      email: ['already exists'],
      password: ['is invalid']
    });
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.directive(NgbAlert));
    expect(alert).withContext('You should have NgbAlert for error messages').not.toBeNull();

    const alertComponent = alert.componentInstance as NgbAlert;
    expect(alertComponent.type).withContext('The alert should be a danger one').toBe('danger');
    expect(alertComponent.dismissible)
      .withContext('The alert should NOT be dismissible')
      .toBe(false);

    const errors = element.querySelectorAll('li');
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].textContent).toContain('email already exists');
    expect(errors[1].textContent).toContain('password is invalid');
  });
});
