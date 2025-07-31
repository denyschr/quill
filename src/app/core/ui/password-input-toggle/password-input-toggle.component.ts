import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ql-password-input-toggle',
  template: `
    <button
      data-test="toggle-password-button"
      class="btn btn-outline-primary"
      type="button"
      ngbTooltip="Toggle visibility"
      placement="bottom"
      (click)="toggle()"
    >
      <span
        data-test="toggle-password-button-icon"
        class="bi"
        [class]="visible ? 'bi-eye' : 'bi-eye-slash'"
      ></span>
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
  protected visible = false;

  @Input({ required: true })
  public input!: HTMLInputElement;

  protected toggle(): void {
    this.visible = !this.visible;
    this.input.type = this.visible ? 'text' : 'password';
    this.input.focus();
  }
}
