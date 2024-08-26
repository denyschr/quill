import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public getToken(): string | null {
    return window.localStorage.getItem('jwtToken');
  }

  public saveToken(token: string): void {
    window.localStorage.setItem('jwtToken', token);
  }

  public removeToken(): void {
    window.localStorage.removeItem('jwtToken');
  }
}
