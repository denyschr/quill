import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FeedType } from '@/app/articles/data-access/models';

@Component({
  selector: 'ql-feed-tabs',
  template: `
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          data-test="feed-tab"
          class="nav-link"
          [class]="feedType === 'global' && !tag ? 'active pe-none' : null"
          (click)="changed.emit('global')"
          >Global Feed</a
        >
      </li>

      @if (!feedDisabled) {
        <li class="nav-item">
          <a
            data-test="feed-tab"
            class="nav-link"
            [class]="feedType === 'feed' && !tag ? 'active pe-none' : null"
            (click)="changed.emit('feed')"
            >Your Feed</a
          >
        </li>
      }

      @if (tag) {
        <li class="nav-item">
          <a data-test="feed-tab" class="nav-link active pe-none">#{{ tag }}</a>
        </li>
      }
    </ul>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedTabsComponent {
  @Input()
  public feedType: FeedType = 'global';

  @Input()
  public feedDisabled = true;

  @Input()
  public tag?: string;

  @Output()
  public readonly changed = new EventEmitter<FeedType>();
}
