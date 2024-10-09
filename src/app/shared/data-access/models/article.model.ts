import { ProfileModel } from './profile.model';

export interface ArticleModel {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ProfileModel;
}

export type FeedType = 'all' | 'feed';

export interface ArticleListResponseModel {
  articles: ArticleModel[];
  articlesCount: number;
}

export interface ArticleListConfigModel {
  type: FeedType;
  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  };
}

export interface ArticleFormDataModel {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}
