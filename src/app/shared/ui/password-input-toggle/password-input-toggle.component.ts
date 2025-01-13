import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ql-password-input-toggle',
  template: `
    <button
      class="btn btn-outline-primary"
      type="button"
      ngbTooltip="Toggle visibility"
      placement="bottom"
      (click)="toggle()"
    >
      <i class="bi" [class]="visible ? 'bi-eye' : 'bi-eye-slash'"></i>
    </button>
  `,
  styles: [
    `
      button {
        border-radius: inherit;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    `
  ],
  standalone: true,
  imports: [NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputToggleComponent {
  public visible = false;

  @Input({ required: true })
  public input!: HTMLInputElement;

  public toggle(): void {
    this.visible = !this.visible;
    this.input.type = this.visible ? 'text' : 'password';
    this.input.focus();
  }
}
