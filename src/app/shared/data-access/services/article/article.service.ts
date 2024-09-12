/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleListConfigModel, ArticleResponseModel } from '@shared/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  public constructor(private readonly _http: HttpClient) {}

  public getList(config: ArticleListConfigModel): Observable<ArticleResponseModel> {
    const params = new HttpParams();
    Object.keys(config.filters).forEach(key => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this._http.get<ArticleResponseModel>(
      `/articles${config.type === 'feed' ? '/feed' : ''}`,
      { params }
    );
  }
}
