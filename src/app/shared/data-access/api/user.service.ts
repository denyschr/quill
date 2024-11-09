import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from '@shared/data-access/models';
import { LoginCredentialsModel, RegisterCredentialsModel } from '@auth/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly _http: HttpClient) {}

  public getCurrentUser(): Observable<UserModel> {
    return this._http.get<{ user: UserModel }>(`/user`).pipe(map(({ user }) => user));
  }

  public register(credentials: RegisterCredentialsModel): Observable<UserModel> {
    return this._http
      .post<{ user: UserModel }>(`/users`, { user: credentials })
      .pipe(map(({ user }) => user));
  }

  public login(credentials: LoginCredentialsModel): Observable<UserModel> {
    return this._http
      .post<{ user: UserModel }>(`/users/login`, { user: credentials })
      .pipe(map(({ user }) => user));
  }

  public update(user: Partial<UserModel>): Observable<UserModel> {
    return this._http.put<{ user: UserModel }>('/user', { user }).pipe(map(({ user }) => user));
  }
}
