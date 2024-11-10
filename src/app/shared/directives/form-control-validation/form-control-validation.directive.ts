/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName]',
  standalone: true,
  host: {
    '[class.is-invalid]': 'invalid'
  }
})
export class FormControlValidationDirective {
  public get invalid(): boolean | null {
    return this._ngControl.touched && this._ngControl.invalid;
  }

  constructor(@Optional() private readonly _ngControl: NgControl) {}
}
