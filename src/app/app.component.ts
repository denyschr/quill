import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authActions } from '@auth/data-access/store';
import { Store } from '@ngrx/store';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'ql-root',
  standalone: true,
  template: `<router-outlet />`,
  styles: [``],
  imports: [RouterOutlet],
  providers: []
})
export class AppComponent implements OnInit {
  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
