import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';

import { ConfirmModalContentComponent } from './confirm-modal-content.component';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  template: `<ql-confirm-modal-content [title]="title" [message]="message" />`,
  standalone: true,
  imports: [ConfirmModalContentComponent]
})
class ConfirmModalContentTestComponent {
  public title = 'Confirmation';
  public message = 'Are you sure you want to do this?';
}

describe('ConfirmModalContentComponent', () => {
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(() => {
    mockActiveModal = jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['dismiss', 'close']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgbActiveModal,
          useValue: mockActiveModal
        }
      ]
    });
  });

  it('should display a modal header', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const title = element.querySelector('h1')!;
    expect(title).not.toBeNull();
    expect(title.id).toBe('confirmation-modal-title');
    expect(title.textContent).toContain(fixture.componentInstance.title);

    const closeButton = element.querySelector('button.btn-close')!;
    expect(closeButton).not.toBeNull();
    expect(closeButton.getAttribute('aria-labelledby')).toBe('confirmation-modal-title');
  });

  it('should display a modal body', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector('p')!;
    expect(message).not.toBeNull();
    expect(message.textContent).toContain(fixture.componentInstance.message);
  });

  it('should display a modal footer', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const cancelButton = element.querySelector('button.btn-outline-secondary')!;
    expect(cancelButton).not.toBeNull();
    expect(cancelButton.textContent).toContain('Cancel');

    const confirmButton = element.querySelector('button.btn-danger')!;
    expect(confirmButton).not.toBeNull();
    expect(confirmButton.textContent).toContain('Ok');
  });

  it('should call the dismiss method when clicking the close button', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('button.btn-close')!.click();

    expect(mockActiveModal.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call the dismiss method when clicking the cancel button', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('button.btn-outline-secondary')!.click();

    expect(mockActiveModal.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call the close method when clicking the confirm button', () => {
    const fixture = TestBed.createComponent(ConfirmModalContentTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('button.btn-danger')!.click();

    expect(mockActiveModal.close).toHaveBeenCalledWith(true);
  });
});
