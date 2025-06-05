import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

import { selectCurrentUser } from '@/app/auth/data-access/state';
import {
  articleListActions,
  articleListInitialState,
  selectConfig
} from '@/app/articles/data-access/state/article-list';
import { ArticleListComponent } from '@/app/articles/feature/article-list';
import { FeedType } from '@/app/articles/data-access/models';

import { TagsComponent } from '../ui/tags';
import {
  selectLoading as selectTagsLoading,
  selectTags,
  tagsActions
} from '../data-access/state/tags';
import { FeedTabsComponent } from '../ui/feed-tabs';

@Component({
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      <div class="container">
        <div class="row py-5">
          <div class="col-md-9">
            <ql-feed-tabs
              [feedType]="vm.config.type"
              [feedDisabled]="!vm.authenticated"
              [tag]="vm.config.filters.tag"
              (changed)="changeFeed($event)"
            />
            <ql-article-list />
          </div>

          <div class="col-md-3">
            <ql-tags [tags]="vm.tags" [loading]="vm.tagsLoading" (clicked)="setTag($event)" />
          </div>
        </div>
      </div>
    </ng-container>
  `,
  standalone: true,
  imports: [LetDirective, FeedTabsComponent, TagsComponent, ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  protected readonly vm$ = combineLatest({
    config: this.store.select(selectConfig),
    tags: this.store.select(selectTags),
    tagsLoading: this.store.select(selectTagsLoading),
    authenticated: this.store.select(selectCurrentUser)
  });

  constructor(private readonly store: Store) {
    this.store.dispatch(tagsActions.loadTags());
    this.changeFeed('global');
  }

  protected changeFeed(type: FeedType = 'global'): void {
    this.store.dispatch(
      articleListActions.setConfig({
        config: {
          ...articleListInitialState.config,
          type
        }
      })
    );
  }

  protected setTag(tag: string): void {
    this.store.dispatch(
      articleListActions.setConfig({
        config: {
          ...articleListInitialState.config,
          filters: {
            ...articleListInitialState.config.filters,
            tag
          }
        }
      })
    );
  }
}
