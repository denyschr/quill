import { ArticleModel } from '@shared/data-access/models';

export interface ArticleStateModel {
  article: ArticleModel | null;
  loading: boolean;
  error: string | null;
}
