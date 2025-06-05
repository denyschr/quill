import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formControlName]',
  standalone: true,
  host: {
    '[class.is-invalid]': 'invalid'
  }
})
export class FormControlValidationDirective {
  protected get invalid(): boolean | null {
    return this.ngControl.touched && this.ngControl.invalid;
  }

  constructor(@Optional() private readonly ngControl: NgControl) {}
}
