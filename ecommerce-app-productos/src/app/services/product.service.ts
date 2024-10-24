import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductoDTO } from '../models/producto-dto';
import { map, Observable } from 'rxjs';
import bigDecimal from 'js-big-decimal';
import { AuthService } from './auth.service';
import { ProductoResponseDTO } from '../models/producto-response-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.API_URL}Servicio/Product`;

  constructor(private http: HttpClient,private autservice:AuthService) { }
  private convertToBigDecimal(producto: any): ProductoDTO {
    return {
      ...producto,
      precio: new bigDecimal(producto.precio)
    };
  }

  getProductosActivos(): Observable<ProductoDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(productos => productos.map(this.convertToBigDecimal))
    );
  }

  buscarProductos(searchTerm: string): Observable<ProductoDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/`, { params: { searchTerm } }).pipe(
      map(productos => productos.map(this.convertToBigDecimal))
    );
  }

  crearProducto(producto: ProductoResponseDTO): Observable<ProductoResponseDTO> {
    const id  = this.autservice.getUserId()
    console.log("aaaaaaa",id)
    const productoParaEnviar = {
      ...producto,
      createdId: id
    };
    return this.http.post<any>(`${this.apiUrl}/CrearProducto`, productoParaEnviar).pipe(
      map(this.convertToBigDecimal)
    );
  }

  actualizarProducto(id: number, producto: ProductoDTO): Observable<ProductoDTO> {
    const productoParaEnviar = {
      ...producto,
      
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, productoParaEnviar).pipe(
      map(this.convertToBigDecimal)
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
