import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DefaultValidationErrorsDirective,
  ValdemortConfig,
  ValidationErrorDirective
} from 'ngx-valdemort';

@Component({
  selector: 'ql-validation-defaults',
  standalone: true,
  template: `
    <val-default-errors>
      <ng-template valError="required" let-label>
        <i class="bi bi-x-circle"></i>
        {{ label || 'Input' }} is required.</ng-template
      >

      <ng-template valError="email" let-label>
        <i class="bi bi-x-circle"></i>
        {{ label || 'Input' }} must be a valid email address.
      </ng-template>

      <ng-template valError="minlength" let-error="error" let-label>
        <i class="bi bi-x-circle"></i>
        {{ label || 'Input' }} must be at least {{ error.requiredLength | number }} characters long.
      </ng-template>
    </val-default-errors>
  `,
  imports: [DecimalPipe, DefaultValidationErrorsDirective, ValidationErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationDefaultsComponent {
  public constructor(config: ValdemortConfig) {
    config.errorsClasses = 'invalid-feedback';
  }
}
