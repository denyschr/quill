import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ql-loading-spinner',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {}
