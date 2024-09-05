/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendErrorsComponent } from './backend-errors.component';
import { By } from '@angular/platform-browser';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<ql-backend-errors [errors]="backendErrors" />`,
  imports: [BackendErrorsComponent]
})
class BackendErrorsTestComponent {
  public backendErrors = {
    'email or password': ['is invalid']
  };
}

describe('BackendErrorsComponent', () => {
  let fixture: ComponentFixture<BackendErrorsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(BackendErrorsTestComponent);
    fixture.detectChanges();
  });

  it('shoud use the ngb-alert component', () => {
    const element = fixture.debugElement;
    const ngbAlert = element.query(By.directive(NgbAlert));
    expect(ngbAlert)
      .withContext('You probably forgot to add `NgbAlert` to the `BackendErrorsComponent` template')
      .not.toBeNull();
    expect(ngbAlert.nativeElement.getAttribute('type'))
      .withContext('The `type` attribute of the `ngb-alert` is not correct')
      .toBe('danger');
    expect(ngbAlert.componentInstance.dismissible)
      .withContext('The `dismissible` property of the `ngb-alert` is not correct')
      .toBeFalsy();
  });

  it('should display an error', () => {
    const element = fixture.nativeElement as HTMLElement;
    const li = element.querySelector<HTMLLIElement>('li')!;
    expect(li).withContext('You should have a `li` element for the error').not.toBeNull();
    expect(li.textContent)
      .withContext('The error message is not correct')
      .toContain('email or password is invalid');
  });
});
