import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { ConfirmService } from '@app/shared/data-access/services';

export interface UnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const formGuard: CanDeactivateFn<UnsavedChanges> = (component: UnsavedChanges) => {
  const confirmService = inject(ConfirmService);

  if (component.hasUnsavedChanges()) {
    return confirmService.confirm({
      title: 'You have unsaved changes!',
      message: 'Are you sure you want to leave this page?'
    });
  }

  return of(true);
};
