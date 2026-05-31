import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const rawToken = this.authService.tokenValue;
    const token = rawToken?.trim().replace(/^Bearer\s+/i, '') ?? null;
    console.log('[AuthInterceptor] url=', req.url, 'rawToken=', rawToken ? '***' : 'none', 'normalized=', token ? '***' : 'none');
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;
    console.log('[AuthInterceptor] attached Authorization=', authReq.headers.get('Authorization'));

    return next.handle(authReq).pipe(
      tap({
        error: (error) => {
          if (error?.status === 401) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        },
      })
    );
  }
}
