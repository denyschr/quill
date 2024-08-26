import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'ql-root',
  standalone: true,
  template: `<router-outlet />`,
  styles: [``],
  imports: [RouterOutlet],
  providers: []
})
export class AppComponent {}
