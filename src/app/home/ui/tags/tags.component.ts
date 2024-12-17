import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ql-tags',
  template: `
    <h2 class="mb-3 fs-4 fw-bold">Popular tags</h2>
    @if (!loading) {
      <div class="d-flex flex-wrap m-0 gap-2">
        @for (tag of tags; track tag) {
          <a (click)="clicked.emit(tag)">
            <span class="fs-6 badge rounded-pill text-bg-secondary">{{ tag }}</span>
          </a>
        } @empty {
          <div data-test="no-tags">No tags found</div>
        }
      </div>
    } @else {
      <div data-test="loading">Loading tags...</div>
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
