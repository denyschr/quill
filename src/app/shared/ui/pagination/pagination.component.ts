import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

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
          [routerLink]="url"
          [queryParams]="{ page: page }"
          >{{ page }}</a
        >
      }
    </div>
  `,
  imports: [NgClass, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit {
  @Input({ required: true })
  public url!: string;

  @Input()
  public itemCount = 0;

  @Input()
  public limit = 20;

  @Input()
  public currentPage = 1;

  public totalPages: number[] = [];

  public ngOnInit(): void {
    this.totalPages = Array.from(
      { length: Math.ceil(this.itemCount / this.limit) },
      (_, index) => index + 1
    );
  }
}
