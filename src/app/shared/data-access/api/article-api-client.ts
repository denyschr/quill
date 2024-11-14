import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ArticleListConfigModel,
  ArticleListResponseModel,
  ArticleModel
} from '@shared/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class ArticleApiClient {
  constructor(private readonly _http: HttpClient) {}

  public getAll(config: ArticleListConfigModel): Observable<ArticleListResponseModel> {
    let params = new HttpParams();
    Object.keys(config.filters).forEach(key => {
      // @ts-expect-error: String keys might not exist
      params = params.set(key, config.filters[key]);
    });

    return this._http.get<ArticleListResponseModel>(
      `/articles${config.type === 'feed' ? '/feed' : ''}`,
      { params }
    );
  }

  public get(slug: string): Observable<ArticleModel> {
    return this._http
      .get<{ article: ArticleModel }>(`/articles/${slug}`)
      .pipe(map(({ article }) => article));
  }

  public create(article: Partial<ArticleModel>): Observable<ArticleModel> {
    return this._http
      .post<{ article: ArticleModel }>('/articles', { article: article })
      .pipe(map(({ article }) => article));
  }

  public update(slug: string, article: Partial<ArticleModel>): Observable<ArticleModel> {
    return this._http
      .put<{ article: ArticleModel }>(`/articles/${slug}`, { article: article })
      .pipe(map(({ article }) => article));
  }

  public delete(slug: string): Observable<void> {
    return this._http.delete<void>(`/articles/${slug}`);
  }

  public favorite(slug: string): Observable<ArticleModel> {
    return this._http
      .post<{ article: ArticleModel }>(`/articles/${slug}/favorite`, {})
      .pipe(map(({ article }) => article));
  }

  public unfavorite(slug: string): Observable<ArticleModel> {
    return this._http
      .delete<{ article: ArticleModel }>(`/articles/${slug}/favorite`)
      .pipe(map(({ article }) => article));
  }
}
