import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private readonly _http: HttpClient) {}

  public getAll(): Observable<string[]> {
    return this._http.get<{ tags: string[] }>('/tags').pipe(map(({ tags }) => tags));
  }
}
