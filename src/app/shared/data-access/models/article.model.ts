export interface ArticleModel {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  // TODO: Add author model
}

export interface ArticleResponseModel {
  articles: ArticleModel[];
  articlesCount: number;
}

export interface ArticleListConfigModel {
  type: string;
  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  };
}
