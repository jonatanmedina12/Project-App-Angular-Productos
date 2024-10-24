import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventarioDTO } from '../models/inventario-dto';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { StockOperation } from '../models/stock-operation';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = `${environment.API_URL}Servicio/Stock/`;

  constructor(private http: HttpClient) { }

  obtenerTodoElInventario(): Observable<InventarioDTO[]> {
    return this.http.get<InventarioDTO[]>(`${this.apiUrl}my-history`);
  }

  obtenerInventarioPorProductoId(productoId: number): Observable<InventarioDTO> {
    return this.http.get<InventarioDTO>(`${this.apiUrl}/${productoId}`);
  }

  crearInventario(inventarioDTO: InventarioDTO): Observable<InventarioDTO> {
    return this.http.post<InventarioDTO>(this.apiUrl, inventarioDTO);
  }

  actualizarInventario(productoId: number, inventarioDTO: StockOperation): Observable<InventarioDTO> {
    return this.http.put<InventarioDTO>(`${this.apiUrl}${productoId}/update`, inventarioDTO);
  }

  eliminarInventario(productoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productoId}`);
  }

  actualizarStock(productoId: number, cantidad: number): Observable<InventarioDTO> {
    const params = new HttpParams().set('cantidad', cantidad.toString());
    return this.http.put<InventarioDTO>(`${this.apiUrl}/${productoId}/actualizar-stock`, null, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerInventarioActualizado(productoId: number): Observable<InventarioDTO> {
    return this.http.get<InventarioDTO>(`${this.apiUrl}/${productoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  verificarDisponibilidad(productoId: number, cantidadRequerida: number): Observable<boolean> {
    const params = new HttpParams().set('cantidadRequerida', cantidadRequerida.toString());
    return this.http.get<boolean>(`${this.apiUrl}/${productoId}/verificar-disponibilidad`, { params });
  }
}
