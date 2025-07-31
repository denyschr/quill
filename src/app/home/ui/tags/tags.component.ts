import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ql-tags',
  template: `
    <h2 data-test="tags-title" class="fs-3">Popular tags</h2>
    @if (!loading) {
      <div class="d-flex flex-wrap gap-2 m-0">
        @for (tag of tags; track tag) {
          <a data-test="tag-link" (click)="clicked.emit(tag)">
            <span class="fs-6 badge rounded-pill text-bg-secondary">{{ tag }}</span>
          </a>
        } @empty {
          <div data-test="no-tag-list-message">No tags found</div>
        }
      </div>
    } @else {
      <div data-test="loading-tag-list-message">Loading tags...</div>
    }
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {
  @Input()
  public tags: string[] = [];

  @Input()
  public loading = false;

  @Output()
  public readonly clicked = new EventEmitter<string>();
}
