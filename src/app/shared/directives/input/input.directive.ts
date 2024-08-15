import { Directive, ElementRef, HostBinding, Input, Optional, Self } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { InputTypeModel } from '../../models/input.model';

@Directive({
  selector: '[qlInput]',
  standalone: true
})
export class InputDirective {
  @HostBinding('attr.type')
  @Input()
  public type?: InputTypeModel;

  public get hasError(): boolean | null {
    return this._ngControl?.status === 'INVALID' && this._ngControl?.touched;
  }

  public get error(): [string, any] {
    const key = Object.keys(this._ngControl.errors as ValidationErrors)[0];
    return [key, this._ngControl.errors![key]];
  }

  public constructor(
    @Optional() @Self() private readonly _ngControl: NgControl,
    private readonly _elementRef: ElementRef<HTMLInputElement>
  ) {}

  public focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
