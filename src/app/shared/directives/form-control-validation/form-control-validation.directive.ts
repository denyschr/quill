/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValdemortConfig } from 'ngx-valdemort';

@Directive({
  selector: '[formControlName]',
  standalone: true,
  host: {
    '[class.is-invalid]': 'invalid'
  }
})
export class FormControlValidationDirective {
  public get invalid(): boolean | null {
    return (
      this._ngControl &&
      this._ngControl.control &&
      this._ngControl.touched &&
      this._ngControl.invalid &&
      this._config.shouldDisplayErrors(
        this._ngControl.control,
        (this._ngControl as any).formDirective
      )
    );
  }

  constructor(
    @Optional() private readonly _ngControl: NgControl,
    private readonly _config: ValdemortConfig
  ) {}
}
