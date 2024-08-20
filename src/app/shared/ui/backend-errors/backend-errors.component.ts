import { Component, Input } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { KeyValuePipe } from '@angular/common';
import { BackendErrorsModel } from '@shared/data-access/models';

@Component({
  selector: 'ql-backend-errors',
  standalone: true,
  template: `
    @if (errors) {
      <ngb-alert type="danger" [dismissible]="false">
        <ul class="m-0">
          @for (error of errors | keyvalue; track error.key) {
            <li>{{ error.key }} {{ error.value }}</li>
          }
        </ul>
      </ngb-alert>
    }
  `,
  styles: [``],
  imports: [NgbAlert, KeyValuePipe],
  providers: []
})
export class BackendErrorsComponent {
  @Input({ required: true })
  public errors: BackendErrorsModel | null = null;
}
