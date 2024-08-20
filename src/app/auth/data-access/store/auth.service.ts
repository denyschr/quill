import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterCredentialsModel } from '../models/register-credentials.model';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';

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
}
