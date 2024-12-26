/* eslint-disable @angular-eslint/component-selector */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'button[qlIconButton]',
  template: `<i class="bi" [ngClass]="icon" aria-hidden="true"></i>`,
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @Input('qlIconButton')
  public icon = '';
}
