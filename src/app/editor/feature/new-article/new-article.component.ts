import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ql-new-article',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-6 offset-md-3">
          <!-- TODO: Place the article form -->
        </div>
      </div>
    </div>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class NewArticleComponent {}
