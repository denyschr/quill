import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public saveToken(token: string): void {
    window.localStorage.setItem('accessToken', token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem('accessToken');
  }
}
