import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '@shared/data-access/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiClient {
  constructor(private readonly _http: HttpClient) {}

  public get(username: string): Observable<Profile> {
    return this._http
      .get<{ profile: Profile }>(`/profiles/${username}`)
      .pipe(map(response => response.profile));
  }
}
