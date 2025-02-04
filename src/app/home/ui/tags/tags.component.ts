import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ql-tags',
  template: `
    <h2 class="fs-3">Popular tags</h2>
    @if (!loading) {
      <div class="d-flex flex-wrap gap-2 m-0">
        @for (tag of tags; track tag) {
          <a (click)="clicked.emit(tag)">
            <span class="fs-6 badge rounded-pill text-bg-secondary">{{ tag }}</span>
          </a>
        } @empty {
          <div id="no-tags-message">No tags found</div>
        }
      </div>
    } @else {
      <div id="loading-tags-message">Loading tags...</div>
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
