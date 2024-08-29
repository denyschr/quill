import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { IconButtonComponent } from '@shared/ui/icon-button';

@Component({
  selector: 'ql-password-input-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn btn-outline-secondary"
      placement="bottom"
      ngbTooltip="Toggle visibility"
      container="body"
      [qlIconButton]="visible ? 'bi-eye-slash' : 'bi-eye'"
      (click)="toggle()"
    ></button>
  `,
  styles: [
    `
      .btn {
        border-radius: inherit;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    `
  ],
  imports: [NgbTooltip, IconButtonComponent],
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
