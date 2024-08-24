import { Component, ContentChild } from '@angular/core';
import { ErrorComponent } from '@shared/ui/error';
import { InputDirective } from '@shared/directives/input';

@Component({
  selector: 'ql-form-field',
  standalone: true,
  template: `
    <ng-content select="label" />
    <div class="input-group">
      <ng-content select="input" />
      <ng-content slect="button" />
    </div>
    @if (input?.hasError) {
      <ql-error [error]="input!.error" />
    }
  `,
  styles: [``],
  imports: [ErrorComponent],
  providers: []
})
export class FormFieldComponent {
  @ContentChild(InputDirective, { static: true })
  public input?: InputDirective;
}
