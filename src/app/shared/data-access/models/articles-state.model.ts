import { ArticleListResponseModel } from './article.model';

export interface ArticlesStateModel {
  data: ArticleListResponseModel | null;
  loading: boolean;
  error: string | null;
}
