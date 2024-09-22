import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { ArticlePreviewComponent } from '@shared/ui/article-preview';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner';
import { ErrorComponent } from '@shared/ui/error';
import { ArticleModel } from '@shared/data-access/models';

@Component({
  selector: 'ql-article-list',
  standalone: true,
  template: `
    @if (loading) {
      <ql-loading-spinner />
    }
    @if (error) {
      <ql-error [message]="error" />
    }
    @if (articles) {
      <div class="d-flex flex-column row-gap-4">
        @for (article of articles; track article.slug) {
          <ql-article-preview [article]="article" />
        } @empty {
          <p>No articles are here yet...</p>
        }
      </div>
    }
  `,
  imports: [LetDirective, ArticlePreviewComponent, LoadingSpinnerComponent, ErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
  @Input()
  public articles?: ArticleModel[];

  @Input()
  public loading = false;

  @Input()
  public error: string | null = null;
}
