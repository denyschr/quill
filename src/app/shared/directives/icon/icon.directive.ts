import { Directive, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ql-icon',
  host: {
    '[innerHTML]': 'safeIcon',
    '[attr.aria-hidden]': 'true'
  },
  standalone: true
})
export class IconDirective {
  public safeIcon?: SafeHtml;

  @Input({ required: true })
  public set icon(icon: string) {
    this.safeIcon = this._sanitizer.bypassSecurityTrustHtml(icon);
  }

  constructor(private readonly _sanitizer: DomSanitizer) {}
}
