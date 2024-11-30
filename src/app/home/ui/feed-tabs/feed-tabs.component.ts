import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedType } from '@shared/data-access/models';

@Component({
  selector: 'ql-feed-tabs',
  template: `
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          class="nav-link"
          [class.active]="feedType === 'global' && !tag"
          (click)="changed.emit('global')"
          >Global Feed</a
        >
      </li>

      @if (!feedDisabled) {
        <li class="nav-item">
          <a
            class="nav-link"
            [class.active]="feedType === 'feed' && !tag"
            (click)="changed.emit('feed')"
            >Your Feed</a
          >
        </li>
      }

      @if (tag) {
        <li class="nav-item">
          <a class="nav-link active">#{{ tag }}</a>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      a {
        cursor: pointer;
        &.active {
          pointer-events: none;
        }
      }
    `
  ],
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
