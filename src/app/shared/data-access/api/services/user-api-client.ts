import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '@shared/data-access/api/models';
import { LoginCredentials, RegisterCredentials } from '@auth/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class UserApiClient {
  constructor(private readonly _http: HttpClient) {}

  public getCurrentUser(): Observable<User> {
    return this._http.get<{ user: User }>(`/user`).pipe(map(response => response.user));
  }

  public register(credentials: RegisterCredentials): Observable<User> {
    return this._http
      .post<{ user: User }>(`/users`, { user: credentials })
      .pipe(map(response => response.user));
  }

  public login(credentials: LoginCredentials): Observable<User> {
    return this._http
      .post<{ user: User }>(`/users/login`, { user: credentials })
      .pipe(map(response => response.user));
  }

  public update(user: Partial<User>): Observable<User> {
    return this._http.put<{ user: User }>('/user', { user }).pipe(map(response => response.user));
  }
}
