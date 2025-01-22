import { Article } from './article';

export interface ArticleListResponse {
  articles: Article[];
  articlesCount: number;
}

export type FeedType = 'global' | 'feed';

export interface ArticleListFilters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface ArticleListConfig {
  type: FeedType;
  currentPage: number;
  filters: ArticleListFilters;
}
