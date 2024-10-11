import { ArticleModel, BackendErrorsModel } from '@shared/data-access/models';

export interface EditArticleStateModel {
  article: ArticleModel | null;
  submitting: boolean;
  loading: boolean;
  errors: BackendErrorsModel | null;
}
