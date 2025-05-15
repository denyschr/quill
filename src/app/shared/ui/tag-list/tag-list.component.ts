import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ql-tag-list',
  template: `
    <ul class="d-flex flex-wrap gap-2 list-unstyled m-0">
      @for (tag of tags; track tag) {
        <li>
          <span class="badge border fw-normal text-secondary rounded-pill">{{ tag }}</span>
        </li>
      }
    </ul>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {
  @Input()
  public tags: string[] = [];
}
