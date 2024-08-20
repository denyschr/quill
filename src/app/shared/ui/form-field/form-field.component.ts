import { Component, ContentChild, Input } from '@angular/core';
import { ErrorComponent } from '@shared/ui/error';
import { InputDirective } from '@shared/directives/input';

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
      <ql-error [error]="input!.error" [controlKey]="controlKey" />
    }
  `,
  styles: [``],
  imports: [ErrorComponent],
  providers: []
})
export class FormFieldComponent {
  @Input({ required: true })
  public controlKey!: string | number;

  @ContentChild(InputDirective)
  public input?: InputDirective;
}
