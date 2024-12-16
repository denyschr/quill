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
      <ng-template valError="required" let-label>{{ label || 'Input' }} is required.</ng-template>

      <ng-template valError="email" let-label>
        {{ label || 'Input' }} must be a valid email address.
      </ng-template>

      <ng-template valError="minlength" let-error="error" let-label>
        {{ label || 'Input' }} must be at least {{ error.requiredLength | number }} characters long.
      </ng-template>
    </val-default-errors>
  `,
  imports: [DecimalPipe, DefaultValidationErrorsDirective, ValidationErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationDefaultsComponent {
  constructor(config: ValdemortConfig) {
    config.errorsClasses = 'invalid-feedback';
  }
}
