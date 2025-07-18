import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { KeyValuePipe } from '@angular/common';

import { BackendErrors } from '@/app/core/data-access/models';

@Component({
  selector: 'ql-backend-errors',
  template: `
    <ngb-alert type="danger" [dismissible]="false">
      <ul class="m-0">
        @for (error of errors | keyvalue; track error.key) {
          <li>{{ error.key }} {{ error.value }}</li>
        }
      </ul>
    </ngb-alert>
  `,
  standalone: true,
  imports: [NgbAlert, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackendErrorsComponent {
  @Input({ required: true })
  public errors!: BackendErrors;
}
