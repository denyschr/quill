import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiClient {
  constructor(private readonly http: HttpClient) {}

  public get(username: string): Observable<Profile> {
    return this.http
      .get<{ profile: Profile }>(`/profiles/${username}`)
      .pipe(map(response => response.profile));
  }

  public follow(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>(`/profiles/${username}/follow`, null)
      .pipe(map(response => response.profile));
  }

  public unfollow(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>(`/profiles/${username}/follow`)
      .pipe(map(response => response.profile));
  }
}
