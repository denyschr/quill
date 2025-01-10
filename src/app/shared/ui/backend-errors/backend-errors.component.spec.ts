import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendErrorsComponent } from './backend-errors.component';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { BackendErrors } from '@shared/data-access/api/models';

describe('BackendErrorsComponent', () => {
  let component: BackendErrorsComponent;
  let fixture: ComponentFixture<BackendErrorsComponent>;

  const errorMessages: BackendErrors = {
    email: ['already exists'],
    'email or password': ['is invalid']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BackendErrorsComponent]
    });

    // turn off the animation for the alert
    const alertConfig = TestBed.inject(NgbAlertConfig);
    alertConfig.animation = false;

    fixture = TestBed.createComponent(BackendErrorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('errors', errorMessages);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error messages', () => {
    const element: HTMLElement = fixture.nativeElement;

    const alert = fixture.debugElement.query(By.directive(NgbAlert));
    expect(alert).withContext('You need `NgbAlert` for error messages').not.toBeNull();

    const alertComponent = alert.componentInstance as NgbAlert;
    expect(alertComponent.type).withContext('The alert should be a danger one').toBe('danger');
    expect(alertComponent.dismissible).withContext('The alert should be dismissible').toBe(false);

    const errors = element.querySelectorAll('li');
    expect(errors.length)
      .withContext('You should have a `li` element for each error message')
      .toBe(2);
    expect(errors[0].textContent).toContain('email already exists');
    expect(errors[1].textContent).toContain('email or password is invalid');
  });
});
