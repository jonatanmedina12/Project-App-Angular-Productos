import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { UsuarioDTO } from '../models/usuario-dto';
import { environment } from '../environments/environment';
import { RefreshTokendto } from '../models/refresh-tokendto';
import { RegisterDto } from '../models/register-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_URL}api/Auth`;
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;

  private token: string ;
  constructor(private http: HttpClient) {
    this.token=""
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
   }

   registerUser(usuario: RegisterDto): Observable<RegisterDto> {
    return this.http.post<RegisterDto>(`${this.apiUrl}/register`, usuario)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400 && error.error?.email) {
            return throwError(() => ({ emailExists: error.error.email[0] }));
          }
          return this.handleError(error);
        })
      );
  }

   login(loginRequest: LoginRequest): Observable<LoginResponse | string | boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        map(response => {
            console.log(response)
          if (response.data.isLoginActivo) {

            return true;
            
          } else {
            this.setSession(response);
            this.currentUserSubject.next(response);

            return response;
          }
        }),
        catchError(this.handleError)
      );
  }



  logout(): Observable<any> {
    const id = this.getUserId();

    if (id) {
      return this.http.post(`${this.apiUrl}/logout`,  id).pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.clearSession();

        }),
        catchError(this.handleError)
      );
    } else {
      this.clearSession();
      this.currentUserSubject.next(null);
      return new Observable(subscriber => subscriber.complete());
    }
  }

  refreshToken(): Observable<boolean> {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('access_token');

    if (!username) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokendto>(`${this.apiUrl}/refresh-token`, {  username,token})
      .pipe(
        tap(response => {
          this.setSessionContinue(response);
        }),
        map(() => true),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  validateEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validar-email`, { email });
  }

  resetPassword(username: string, password: string): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/reset-password`, { username, password });
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  isAdmin(): boolean {
    const user = this.getUserFromStorage();
    return user ? user.data.roles.includes('admin') : false;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  public getUserFromStorage(): LoginResponse | null {
    const user = sessionStorage.getItem('username');
    return user ? JSON.parse(user) : null;
  }
  public getIdFromStorage(): LoginResponse | null {
    const user = sessionStorage.getItem('id');
    return user ? JSON.parse(user) : null;
  }
  public getIdFromStorage2(): number | null {
    const user = sessionStorage.getItem('id');
    return user ? JSON.parse(user) : null;
  }
  public getUserId(): LoginResponse | null {
    const user = this.getIdFromStorage();
    console.log(user)
    return user
  }
  public getUserId2(): number | null {
    const user = this.getIdFromStorage2();
    console.log(user)
    return user
  }
  private clearSession(): void {
    localStorage.clear();
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('access_token');
  }

  private setSession(loginResponse: LoginResponse): void {
    sessionStorage.setItem('username', JSON.stringify(loginResponse.data.username));
    sessionStorage.setItem('id', JSON.stringify(loginResponse.data.id));

    sessionStorage.setItem('access_token', loginResponse.data.token);
  }
  private setSessionContinue(authResult: RefreshTokendto): void {
    sessionStorage.setItem('access_token', authResult.token);

  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error:';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
