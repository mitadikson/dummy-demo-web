import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../api/auth-api.service';
import { ENDPOINTS } from '../constants/endpoints.constants';
import { AuthTokenService } from '../services/auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApiService);
  const authTokenService = inject(AuthTokenService);
  const token = authTokenService.token();

  if (!token?.accessToken || req.url.endsWith(ENDPOINTS.AUTH.REFRESH)) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${token.accessToken}` },
  });

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== HttpStatusCode.Unauthorized) {
        return throwError(() => error);
      }

      return authApiService.refresh().pipe(
        switchMap((refreshedToken) => {
          if (!refreshedToken?.accessToken) {
            return throwError(() => error);
          }

          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedToken.accessToken}`,
              },
            }),
          );
        }),
        catchError((refreshError) => {
          authTokenService.setToken(null);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
