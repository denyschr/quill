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
    return this.ngControl.touched && this.ngControl.invalid;
  }

  constructor(@Optional() private readonly ngControl: NgControl) {}
}
