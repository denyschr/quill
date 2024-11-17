import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ql-tags',
  template: `
    <div class="p-2 rounded bg-body-secondary">
      <h2 class="mb-2 fs-6 text-secondary-emphasis">Popular tags</h2>
      @if (!loading) {
        <ul class="d-flex flex-wrap list-unstyled m-0 gap-2">
          @for (tag of tags; track tag) {
            <li>
              <a class="badge text-bg-success" (click)="selectTag.emit(tag)">
                {{ tag }}
              </a>
            </li>
          } @empty {
            <p>No tags found</p>
          }
        </ul>
      } @else {
        <div>Loading tags...</div>
      }
    </div>
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ],
  host: {
    class: 'col-md-3'
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {
  @Input()
  public tags: string[] = [];

  @Input()
  public loading = false;

  @Output()
  public readonly selectTag = new EventEmitter<string>();
}
