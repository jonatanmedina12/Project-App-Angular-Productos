import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrdenDTO } from '../models/orden-dto';
import { Observable } from 'rxjs';
import { EstadisticasOrdenDTO } from '../models/estadisticas-orden-dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.API_URL}/ordenes`;

  constructor(private http: HttpClient) { }

  crearOrden(ordenDTO: OrdenDTO): Observable<OrdenDTO> {
    return this.http.post<OrdenDTO>(this.apiUrl, ordenDTO);
  }

  obtenerOrdenPorId(id: number): Observable<OrdenDTO> {
    return this.http.get<OrdenDTO>(`${this.apiUrl}/${id}`);
  }

  listarOrdenes(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  obtenerOrdenesPorUsuario(usuarioId: number): Observable<OrdenDTO[]> {
    return this.http.get<OrdenDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerOrdenesPorFecha(fechaInicio: Date, fechaFin: Date): Observable<OrdenDTO[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio.toISOString())
      .set('fechaFin', fechaFin.toISOString());
    return this.http.get<OrdenDTO[]>(`${this.apiUrl}/fecha`, { params });
  }

  getTopVentas(): Observable<OrdenDTO[]> {
    return this.http.get<OrdenDTO[]>(`${this.apiUrl}/top-ventas`);
  }

  actualizarEstadoOrden(id: number, nuevoEstado: string): Observable<OrdenDTO> {
    return this.http.put<OrdenDTO>(`${this.apiUrl}/${id}/estado`, null, { params: { nuevoEstado } });
  }

  cancelarOrden(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerEstadisticasOrdenes(): Observable<EstadisticasOrdenDTO> {
    return this.http.get<EstadisticasOrdenDTO>(`${this.apiUrl}/estadisticas`);
  }
}
