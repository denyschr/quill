import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'ql-pagination',
  standalone: true,
  template: `
    <div class="d-flex flex-wrap gap-2 py-4">
      @for (page of totalPages; track page) {
        @let active = page === currentPage;
        <a
          class="btn"
          [ngClass]="{ 'btn-success': active, 'btn-outline-success': !active }"
          (click)="selectPage.emit(page)"
        >
          {{ page }}
        </a>
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
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {
  public totalPages: number[] = [];

  @Input()
  public itemCount = 0;

  @Input()
  public limit = 20;

  @Input()
  public currentPage = 1;

  @Output()
  public readonly selectPage = new EventEmitter<number>();

  public ngOnInit(): void {
    this.totalPages = Array.from(
      { length: Math.ceil(this.itemCount / this.limit) },
      (_, index) => index + 1
    );
  }
}
