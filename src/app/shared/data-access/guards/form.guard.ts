import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/ui/confirm-modal';
import { from, of } from 'rxjs';
import { UnsavedChanges } from '@shared/data-access/models';

export const formGuard: CanDeactivateFn<UnsavedChanges> = (component: UnsavedChanges) => {
  const modal = inject(NgbModal);

  if (component.hasUnsavedChanges()) {
    const modalRef = modal.open(ConfirmModalComponent);
    return from(modalRef.result);
  }

  return of(true);
};
