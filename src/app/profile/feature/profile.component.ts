import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { selectCurrentUser } from '@auth/data-access/store';
import { environment } from '@environment';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  profileActions,
  selectError,
  selectLoading,
  selectProfile
} from '@profile/data-access/store';
import { ArticlesToggleComponent } from '@profile/ui/articles-toggle';
import { UserInfoComponent } from '@profile/ui/user-info';
import { ArticleListConfigModel } from '@shared/data-access/models';
import {
  articlesActions,
  selectArticlesData,
  selectError as selectArticlesError,
  selectLoading as selectArticlesLoading
} from '@shared/data-access/store/articles';
import { ArticleListComponent } from '@shared/ui/article-list';
import { PaginationComponent } from '@shared/ui/pagination';
import { combineLatest, filter, map } from 'rxjs';

@Component({
  selector: 'ql-profile',
  standalone: true,
  template: `
    <ng-container *ngrxLet="vm$; let vm">
      @if (vm.profile) {
        @let profile = vm.profile;
        <ql-user-info [profile]="profile" [owner]="vm.owner" />

        <div class="container">
          <div class="row py-3">
            <div class="col-md-10 offset-md-1">
              <ql-articles-toggle [username]="profile.username" />
              @let articlesData = vm.articlesData;
              <ql-article-list
                [articles]="articlesData?.articles"
                [loading]="vm.articlesLoading"
                [error]="vm.articlesError"
              />

              @if (articlesData) {
                <ql-pagination
                  [itemCount]="articlesData.articlesCount"
                  [currentPage]="currentPage"
                  [limit]="limit"
                  (selectPage)="selectPage($event)"
                />
              }
            </div>
          </div>
        </div>
      }
    </ng-container>
  `,
  imports: [
    LetDirective,
    UserInfoComponent,
    ArticlesToggleComponent,
    ArticleListComponent,
    PaginationComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProfileComponent implements OnInit, OnChanges {
  public readonly owner$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser).pipe(filter(Boolean)),
    profile: this.store.select(selectProfile).pipe(filter(Boolean))
  }).pipe(map(({ currentUser, profile }) => currentUser.username === profile.username));

  public currentPage = 1;
  public readonly limit = environment.limit;
  public listConfig: ArticleListConfigModel = {
    type: 'all',
    filters: {
      limit: this.limit
    }
  };

  public readonly vm$ = combineLatest({
    profile: this.store.select(selectProfile),
    loading: this.store.select(selectLoading),
    error: this.store.select(selectError),
    articlesData: this.store.select(selectArticlesData),
    articlesLoading: this.store.select(selectArticlesLoading),
    articlesError: this.store.select(selectArticlesError),
    owner: this.owner$
  });

  @Input()
  public username!: string;

  constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.fetchArticles();
  }

  public ngOnChanges(): void {
    if (this.router.url.includes('favorites')) {
      console.log('favorites');
      this.listConfig.filters.favorited = this.username;
    }
    this.store.dispatch(profileActions.getProfile({ username: this.username }));
  }

  public selectPage(page: number): void {
    this.currentPage = page;
    this.listConfig.filters.offset = this.currentPage * this.limit - this.limit;
    this.fetchArticles();
  }

  public fetchArticles(): void {
    this.store.dispatch(
      articlesActions.getArticles({
        config: {
          ...this.listConfig,
          filters: {
            ...this.listConfig.filters
          }
        }
      })
    );
  }
}
