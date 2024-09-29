import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedType } from '@shared/data-access/models';

@Component({
  selector: 'ql-feed-toggle',
  standalone: true,
  template: `
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          id="global-feed"
          class="nav-link"
          [class.active]="feedType === 'all' && !selectedTag"
          (click)="selectFeed.emit('all')"
          >Global Feed</a
        >
      </li>
      @if (!feedDisabled) {
        <li class="nav-item">
          <a
            id="your-feed"
            class="nav-link"
            [class.active]="feedType === 'feed' && !selectedTag"
            (click)="selectFeed.emit('feed')"
            >Your Feed</a
          >
        </li>
      }
      @if (selectedTag) {
        <li class="nav-item">
          <a id="tag" class="nav-link active">#{{ selectedTag }}</a>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedToggleComponent {
  @Input()
  public feedType: FeedType = 'all';

  @Input()
  public feedDisabled = true;

  @Input()
  public selectedTag?: string;

  @Output()
  public readonly selectFeed = new EventEmitter<FeedType>();
}
