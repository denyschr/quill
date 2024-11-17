import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ql-tags',
  template: `
    <h2 class="mb-3 fs-4 fw-bold">Popular tags</h2>
    @if (!loading) {
      <ul class="d-flex flex-wrap m-0 gap-2 list-unstyled">
        @for (tag of tags; track tag) {
          <li>
            <a (click)="tagClicked.emit(tag)">
              <span class="fs-6 badge rounded-pill text-bg-primary">{{ tag }}</span>
            </a>
          </li>
        } @empty {
          <p>No tags found</p>
        }
      </ul>
    } @else {
      <div>Loading tags...</div>
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
  public readonly tagClicked = new EventEmitter<string>();
}
