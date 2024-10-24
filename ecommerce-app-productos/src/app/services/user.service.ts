import { Injectable } from '@angular/core';
import { RegisterDto } from '../models/register-dto';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UsuarioDTO } from '../models/usuario-dto';
import { AuthService } from './auth.service';
import { UsuarioUpdateDto } from '../models/usuario-update-dto';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.API_URL}/usuarios`;
  constructor( private http: HttpClient,private autservice:AuthService) { }

  
  obtenerUsuario(): Observable<UsuarioDTO> {
    const username=this.autservice.getUserFromStorage()
    console.log()

    return this.http.post<UsuarioDTO>(`${this.apiUrl}/usuario`,  {username})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400 && error.error?.email) {
            return throwError(() => ({ emailExists: error.error.email[0] }));
          }
          return this.handleError(error);
        })
      );
  }
  actualizarPerfil(updateDto: UsuarioUpdateDto): Observable<ApiResponse> {
    const formData = new FormData();
        
        if (updateDto.photo) {
            formData.append('photo', updateDto.photo);
        }
        const id = this.autservice.getUserId2() ?? 0; // Si es null, asigna un valor predeterminado, como 0.
        updateDto.Id=id;

        
        // Add other profile fields to formData if needed
        
        return this.http.put<ApiResponse>(`${this.apiUrl}/account/profile`, formData);
  }

  listarUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
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
