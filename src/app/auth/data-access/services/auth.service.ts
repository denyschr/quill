import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from '@shared/data-access/models';
import { RegisterCredentialsModel, LoginCredentialsModel } from '@auth/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(private readonly _http: HttpClient) {}

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
}
