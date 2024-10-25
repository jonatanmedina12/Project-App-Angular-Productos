import { Injectable } from '@angular/core';
import { ProductoDTO } from '../models/producto-dto';
import { Observable } from 'rxjs';
import { ProductoTopVentasDTO } from '../models/producto-top-ventas-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { OrdenDTO } from '../models/orden-dto';
import { ClientesFrecuentesDTO } from '../models/clientes-frecuentes-dto';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = `${environment.API_URL}/reportes`;

  constructor( private http: HttpClient ) { }

  getProductosActivos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.apiUrl}/productos-activos`);
  }

  getTopVentas(): Observable<OrdenDTO[]> {
    return this.http.get<OrdenDTO[]>(`${this.apiUrl}/top-ventas`);
  }

  getClientesFrecuentes(): Observable<ClientesFrecuentesDTO[]> {
    return this.http.get<ClientesFrecuentesDTO[]>(`${this.apiUrl}/clientes-frecuentes`);
  }
}
