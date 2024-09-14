import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArticleListConfigModel } from '@shared/data-access/models';
import { ArticleListComponent } from '@shared/ui/article-list';

@Component({
  selector: 'ql-home',
  standalone: true,
  template: `
    <div class="container">
      <div class="row py-3">
        <div class="col-md-9">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link active">Global Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link">Your Feed</a>
            </li>
          </ul>
          <ql-article-list [config]="listConfig" />
        </div>

        <div class="col-md-3">POPULAR TAGS</div>
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
  imports: [ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  public listConfig: ArticleListConfigModel = {
    type: 'all',
    filters: {}
  };
}
