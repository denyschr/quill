import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenStorage {
  public get(): string | null {
    return window.localStorage.getItem('jwtToken');
  }

  public save(token: string): void {
    window.localStorage.setItem('jwtToken', token);
  }

  public remove(): void {
    window.localStorage.removeItem('jwtToken');
  }
}
