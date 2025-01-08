import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective, icons } from '@shared/directives/icon';

@Component({
  selector: 'ql-password-input-toggle',
  template: `
    <button
      type="button"
      class="btn btn-outline-primary"
      ngbTooltip="Toggle visibility"
      placement="bottom"
      (click)="toggle()"
    >
      <ql-icon [icon]="visible ? icons.showPassword : icons.hidePassword" />
    </button>
  `,
  standalone: true,
  styles: [
    `
      button {
        border-radius: inherit;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    `
  ],
  imports: [NgbTooltip, IconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputToggleComponent {
  public visible = false;
  public icons = icons;

  @Input({ required: true })
  public input!: HTMLInputElement;

  public toggle(): void {
    this.visible = !this.visible;
    this.input.type = this.visible ? 'text' : 'password';
    this.input.focus();
  }
}
