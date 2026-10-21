import { Service, signal } from '@angular/core';
import { AuthResModel } from '../models/auth/auth.res.model';

const TOKEN_KEY = 'auth_token';

@Service()
export class AuthTokenService {
  private readonly accessToken = signal<AuthResModel | null>(this.getToken());

  readonly user = signal<any | null>(null);
  readonly token = this.accessToken.asReadonly();

  constructor() {}

  private getToken(): AuthResModel | null {
    if (typeof localStorage.getItem(TOKEN_KEY) !== 'undefined') {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) as string) as AuthResModel;
    }
    return null;
  }

  setToken(token: AuthResModel | null): void {
    this.accessToken.set(token);

    if (typeof localStorage === 'undefined') {
      return;
    }

    if (token != null) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
}
