import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return router.parseUrl('/auth/login');
  }

  if (!authService.hasRole('admin')) {
    return router.parseUrl('/auth/denied');
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return true;
  }

  if (authService.hasRole('admin')) {
    return router.parseUrl('/admin/dashboard');
  }

  authService.logout();
  return true;
};
