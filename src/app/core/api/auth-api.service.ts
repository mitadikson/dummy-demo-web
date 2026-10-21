import { inject, Service } from '@angular/core';
import { AuthTokenService } from '../services/auth-token.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../constants/endpoints.constants';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthResModel } from '../models/auth/auth.res.model';
import { AuthLoginModel } from '../models/auth/auth.login.model';

@Service()
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly authTokenService = inject(AuthTokenService);

  constructor() {}

  login(authLogin: AuthLoginModel) {
    const body = {
      ...authLogin,
      expiresInMins: 3, // optional, defaults to 60
    };
    return this.httpClient
      .post<AuthResModel>(`${environment.apiUrl}${ENDPOINTS.AUTH.LOGIN}`, {
        ...body,
        withCredentials: true,
      })
      .pipe(
        tap((response: AuthResModel) => {
          this.authTokenService.setToken(response);
        }),
        switchMap(() => {
          return this.me();
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(null);
        }),
      );
  }

  refresh() {
    const body = {
      refreshToken: this.authTokenService.token()?.refreshToken,
      expiresInMins: 3,
    };
    return this.httpClient
      .post<AuthResModel>(`${environment.apiUrl}${ENDPOINTS.AUTH.REFRESH}`, {
        ...body,
        withCredentials: true,
      })
      .pipe(
        tap((response: AuthResModel) => {
          this.authTokenService.setToken(response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(null);
        }),
      );
  }

  me() {
    return this.httpClient
      .get(`${environment.apiUrl}${ENDPOINTS.AUTH.ME}`, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          this.authTokenService.user.set(response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(null);
        }),
      );
  }
}
