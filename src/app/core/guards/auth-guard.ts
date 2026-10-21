import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = inject(AuthTokenService).token();
  if (!token) router.navigate(['/', `auth`]);
  return !!token;
};
