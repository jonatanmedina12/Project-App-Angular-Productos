import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JwtInterceptor is being called');

    const token = this.authService.getAccessToken();
    if (this.isRefreshTokenRequest(request)) {
      return next.handle(request);
    }


    if (token) {
      console.log(token)
      request = this.addToken(request, token);
      console.log(request)
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, Token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${Token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = this.authService.getAccessToken();
        return next.handle(this.addToken(request, newToken!));
      }),
      catchError((refreshError) => {
        this.authService.logout();
        return throwError(() => refreshError);
      })
    );
  }
  private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('/api/auth/refresh-token');
  }

}
