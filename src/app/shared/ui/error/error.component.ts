import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ql-error',
  standalone: true,
  template: `<div id="error">{{ message }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  @Input()
  public message = 'Something went wrong';
}
