import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { ConfirmModal } from '@app/core/ui/confirm';

export interface UnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<UnsavedChanges> = (component: UnsavedChanges) => {
  const confirmModal = inject(ConfirmModal);
  if (component.hasUnsavedChanges()) {
    return confirmModal.confirm({
      title: 'You have unsaved changes!',
      message: 'Are you sure you want to leave this page?'
    });
  }
  return of(true);
};
