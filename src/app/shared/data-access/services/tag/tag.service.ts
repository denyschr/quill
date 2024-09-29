import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  public constructor(private readonly _http: HttpClient) {}

  public getList(): Observable<string[]> {
    return this._http.get<{ tags: string[] }>('/tags').pipe(map(({ tags }) => tags));
  }
}
