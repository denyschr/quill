import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  UserUpdate
} from '@app/auth/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class UserApiClient {
  constructor(private readonly http: HttpClient) {}

  public getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`/user`).pipe(map(response => response.user));
  }

  public register(credentials: RegisterCredentials): Observable<User> {
    return this.http
      .post<{ user: User }>(`/users`, { user: credentials })
      .pipe(map(response => response.user));
  }

  public login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<{ user: User }>(`/users/login`, { user: credentials })
      .pipe(map(response => response.user));
  }

  public update(user: UserUpdate): Observable<User> {
    return this.http.put<{ user: User }>('/user', { user }).pipe(map(response => response.user));
  }
}
