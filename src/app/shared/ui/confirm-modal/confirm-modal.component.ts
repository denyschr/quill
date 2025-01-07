import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ql-confirm-modal',
  template: `
    <div class="modal-header">
      <h1 class="fs-4 modal-title" id="confirmation-modal-title">You have unsaved changes!</h1>
      <button
        type="button"
        class="btn-close"
        aria-describedby="confirmation-modal-title"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to leave this page?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">
        Cancel
      </button>
      <button type="button" class="btn btn-danger" (click)="activeModal.close(true)">Ok</button>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
  public readonly activeModal = inject(NgbActiveModal);
}
