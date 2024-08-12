import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'button[qlIconButton]',
  standalone: true,
  template: `<i class="bi" [ngClass]="icon" aria-hidden="true"></i>`,
  styles: [``],
  imports: [NgClass],
  providers: []
})
export class IconButtonComponent {
  @Input('qlIconButton')
  public icon = '';
}
