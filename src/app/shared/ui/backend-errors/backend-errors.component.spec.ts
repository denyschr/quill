import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendErrorsComponent } from './backend-errors.component';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { BackendErrors } from '@shared/data-access/models';

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

  it('should use the alert component', () => {
    const element = fixture.debugElement;

    const alert = element.query(By.directive(NgbAlert));
    expect(alert)
      .withContext('You should have an `NgbAlert` to display error messages')
      .not.toBeNull();

    const alertComponent = alert.componentInstance as NgbAlert;
    expect(alertComponent.type).withContext('The alert should be a danger one').toBe('danger');
    expect(alertComponent.dismissible).withContext('The alert should be dismissible').toBe(false);
  });

  it('should display the content', () => {
    const element = fixture.debugElement;
    const errors = element.queryAll(By.css('li'));
    expect(errors.length)
      .withContext('You should have two `li` elements for the error messages')
      .toBe(2);
    expect(errors[0].nativeElement.textContent).toContain('email already exists');
    expect(errors[1].nativeElement.textContent).toContain('email or password is invalid');
  });
});
