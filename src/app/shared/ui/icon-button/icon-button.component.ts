import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'button[qlIconButton]',
  standalone: true,
  template: `<i class="bi" [ngClass]="icon" aria-hidden="true"></i>`,
  styles: [``],
  imports: [NgClass],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @Input('qlIconButton')
  public icon = '';
}
