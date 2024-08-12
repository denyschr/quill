import { Component, ContentChild } from '@angular/core';
import { ErrorComponent } from '../error/error.component';
import { InputDirective } from '../../directives/input/input.directive';

@Component({
  selector: 'ql-form-field',
  standalone: true,
  template: `
    <ng-content select="label"></ng-content>
    <div class="input-group">
      <ng-content select="input"></ng-content>
      <ng-content slect="button"></ng-content>
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
  @ContentChild(InputDirective)
  public input?: InputDirective;
}
