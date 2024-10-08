import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ql-tag-list',
  standalone: true,
  template: `
    @if (tags.length) {
      <ul class="d-flex flex-wrap list-unstyled m-0 gap-2">
        @for (tag of tags; track tag) {
          <li class="p-1 badge text-dark border border-secondary">{{ tag }}</li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {
  @Input()
  public tags: string[] = [];
}
