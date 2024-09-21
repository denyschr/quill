import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ql-tag-list',
  standalone: true,
  template: `
    <ul class="d-flex gap-2">
      @for (tag of tags; track tag) {
        <li class="badge text-bg-secondary">{{ tag }}</li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {
  @Input()
  public tags: string[] = [];
}
