import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ql-home',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-9">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active">Global Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link">Your Feed</a>
            </li>
          </ul>
          <div>articles</div>
        </div>
        <div class="col-md-3">
          <div>tags</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .nav-link {
        cursor: pointer;
      }
    `
  ],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {}
