import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ql-root',
  standalone: true,
  template: `<router-outlet />`,
  styles: [``],
  imports: [RouterOutlet],
  providers: []
})
export class AppComponent {}
