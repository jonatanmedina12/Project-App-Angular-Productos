import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientesFrecuentesDTO } from 'src/app/models/clientes-frecuentes-dto';
import { EstadisticasOrdenDTO } from 'src/app/models/estadisticas-orden-dto';
import { OrdenDTO } from 'src/app/models/orden-dto';
import { ProductoDTO } from 'src/app/models/producto-dto';
import { ProductoTopVentasDTO } from 'src/app/models/producto-top-ventas-dto';
import { Section } from 'src/app/models/section';
import { OrderService } from 'src/app/services/order.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-component-main',
  templateUrl: './component-main.component.html',
  styleUrls: ['./component-main.component.css']
})
export class ComponentMainComponent implements OnInit {
  sections: Section[] = [
    { name: 'Productos', route: 'productos', description: 'Gestiona tu catálogo de productos', icon: 'inventory_2' },
    { name: 'Inventarios', route: 'inventarios', description: 'Controla el stock de tus productos', icon: 'list_alt' },
   
  ];
  ordenes: OrdenDTO[] = [];
  topVentas: OrdenDTO[] = [];
  estadisticas: EstadisticasOrdenDTO | null = null;
  clientesFrecuentes: ClientesFrecuentesDTO[] = [];

  page = 0;
  size = 10;
  totalElements = 0;

  constructor(
    private ordenService: OrderService,
    private report: ReportesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
 
  }

  cargarOrdenes() {
    this.ordenService.listarOrdenes(this.page, this.size).subscribe(
      response => {
        this.ordenes = response.content;
        this.totalElements = response.totalElements;
      },
      error => this.mostrarError('Error al cargar órdenes')
    );
  }

  cargarEstadisticas() {
    this.ordenService.obtenerEstadisticasOrdenes().subscribe(
      estadisticas => this.estadisticas = estadisticas,
      error => this.mostrarError('Error al cargar estadísticas')
    );
  }
  cargarClientesFrecuentes() {
    this.report.getClientesFrecuentes().subscribe(
      (data) => {
        this.clientesFrecuentes = data;
      },
      (error) => {
        console.error('Error al cargar clientes frecuentes', error);
        // Manejar el error como prefieras, por ejemplo, mostrando un mensaje al usuario
      }
    );
  }
  cargarTopVentas() {
    this.ordenService.getTopVentas().subscribe(
      topVentas => {
        this.topVentas = topVentas;
      },
      error => this.mostrarError('Error al cargar top ventas')
    );
  }

  cambiarPagina(event: any) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.cargarOrdenes();
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
