import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorComponent } from '@shared/ui/error';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';

@Component({
  selector: 'ql-tags',
  standalone: true,
  template: `
    @if (loading) {
      <ql-loading-spinner />
    }
    @if (error) {
      <ql-error [message]="error" />
    }
    @if (tags) {
      <div class="p-2 rounded bg-body-secondary">
        <h2 class="mb-2 fs-6 text-secondary-emphasis">Popular tags</h2>
        <ul class="d-flex flex-wrap list-unstyled m-0 gap-2">
          @for (tag of tags; track tag) {
            <li>
              <a class="badge text-bg-success" (click)="selectTag.emit(tag)">
                {{ tag }}
              </a>
            </li>
          } @empty {
            No tags are here yet...
          }
        </ul>
      </div>
    }
  `,
  host: {
    class: 'col-md-3'
  },
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ],
  imports: [LoadingSpinnerComponent, ErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {
  @Input()
  public tags: string[] | null = null;

  @Input()
  public loading = false;

  @Input()
  public error: string | null = null;

  @Output()
  public readonly selectTag = new EventEmitter<string>();
}
