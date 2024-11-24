import { Profile } from './profile';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export type FeedType = 'all' | 'feed';

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

export interface ArticleFormData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}
