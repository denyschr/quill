import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ql-confirm-modal-content',
  template: `
    <div class="modal-header">
      <h1 id="confirmation-modal-title" class="fs-4 modal-title">{{ title }}</h1>
      <button
        type="button"
        class="btn-close"
        aria-labelledby="confirmation-modal-title"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
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
export class ConfirmModalContentComponent {
  @Input()
  public title = '';

  @Input()
  public message = '';

  constructor(public readonly activeModal: NgbActiveModal) {}
}
