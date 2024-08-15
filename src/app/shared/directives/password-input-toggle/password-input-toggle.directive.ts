import { Directive, HostBinding, HostListener } from '@angular/core';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { IconButtonComponent } from '../../ui/icon-button/icon-button.component';

@Directive({
  selector: '[qlPasswordInputToggle]',
  standalone: true
})
export class PasswordInputToggleDirective {
  public toggled = false;

  @HostBinding('attr.aria-label')
  public label = 'Toggle visibility';

  public get iconClass(): string {
    return this.toggled ? 'bi-eye-slash' : 'bi-eye';
  }

  public constructor(
    private readonly _formField: FormFieldComponent,
    private readonly _button: IconButtonComponent
  ) {
    this._button.icon = this.iconClass;
  }

  @HostListener('click')
  public onClick() {
    this.toggled = !this.toggled;
    this.update();
    this._formField.input?.focus();
  }

  public update(): void {
    this._button.icon = this.iconClass;
    if (this._formField.input?.type) {
      this._formField.input.type = this.toggled ? 'text' : 'password';
    }
  }
}
