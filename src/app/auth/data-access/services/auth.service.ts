import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from '@shared/data-access/models';
import { environment } from '@environment';
import { RegisterCredentialsModel, LoginCredentialsModel } from '@auth/data-access/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(private readonly _http: HttpClient) {}

  public register(credentials: RegisterCredentialsModel): Observable<UserModel> {
    return this._http
      .post<{ user: UserModel }>(`${environment.apiUrl}/users`, { user: credentials })
      .pipe(map(({ user }) => user));
  }

  public login(credentials: LoginCredentialsModel): Observable<UserModel> {
    return this._http
      .post<{ user: UserModel }>(`${environment.apiUrl}/users/login`, { user: credentials })
      .pipe(map(({ user }) => user));
  }
}
