import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Article, ArticleListConfig, ArticleListResponse } from '@app/articles/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class ArticleApiClient {
  constructor(private readonly _http: HttpClient) {}

  public getAll(config: ArticleListConfig): Observable<ArticleListResponse> {
    let params = new HttpParams();
    Object.keys(config.filters).forEach(key => {
      // @ts-expect-error: String keys might not exist
      params = params.set(key, config.filters[key]);
    });

    return this._http.get<{
      articles: Article[];
      articlesCount: number;
    }>(`/articles${config.type === 'feed' ? '/feed' : ''}`, { params });
  }

  public get(slug: string): Observable<Article> {
    return this._http
      .get<{ article: Article }>(`/articles/${slug}`)
      .pipe(map(response => response.article));
  }

  public create(article: Partial<Article>): Observable<Article> {
    return this._http
      .post<{ article: Article }>('/articles', { article })
      .pipe(map(response => response.article));
  }

  public update(slug: string, article: Partial<Article>): Observable<Article> {
    return this._http
      .put<{ article: Article }>(`/articles/${slug}`, { article })
      .pipe(map(response => response.article));
  }

  public delete(slug: string): Observable<void> {
    return this._http.delete<void>(`/articles/${slug}`);
  }

  public favorite(slug: string): Observable<Article> {
    return this._http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, null)
      .pipe(map(response => response.article));
  }

  public unfavorite(slug: string): Observable<Article> {
    return this._http
      .delete<{ article: Article }>(`/articles/${slug}/favorite`)
      .pipe(map(response => response.article));
  }
}
