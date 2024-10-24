import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadisticasOrdenDTO } from 'src/app/models/estadisticas-orden-dto';
import { InventarioDTO } from 'src/app/models/inventario-dto';
import { OrdenDTO } from 'src/app/models/orden-dto';
import { UsuarioDTO } from 'src/app/models/usuario-dto';
import { InventoryService } from 'src/app/services/inventory.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit  {
  ordenes: OrdenDTO[] = [];
  ordenForm: FormGroup;
  estadisticas: EstadisticasOrdenDTO | null = null;
  page = 0;
  size = 10;
  totalElements = 0;
  usuarios: UsuarioDTO[] = [];
  mostrarFormulario = false;
  inventarios: InventarioDTO[] = [];

  constructor(
    private ordenService: OrderService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private inventarioService : InventoryService
  ) {
    this.ordenForm = this.formBuilder.group({
      usuarioId: ['', Validators.required],
      detalles: this.formBuilder.array([]),
      fecha: [new Date(), Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
      estado: ['PENDIENTE', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarOrdenes();
    this.cargarEstadisticas();
    this.cargarUsuarios();
    this.cargarInventarios();
  }
  cargarInventarios() {
    this.inventarioService.obtenerTodoElInventario().subscribe(
      data => {
        this.inventarios = [...data];
      },
      error => this.mostrarError('Error al cargar inventarios')
    );
  }
  cargarUsuarios() {
    this.userService.listarUsuarios().subscribe(
      usuarios => this.usuarios = usuarios,
      error => this.mostrarError('Error al cargar usuarios')
    );
  }

  get detalles() {
    return this.ordenForm.get('detalles') as FormArray;
  }

  agregarDetalle() {
    const detalleForm = this.formBuilder.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
    this.detalles.push(detalleForm);
  }

  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  calcularTotal() {
    let total = 0;
    for (let detalle of this.detalles.controls) {
      total += detalle.get('cantidad')!.value * detalle.get('precioUnitario')!.value;
    }
    this.ordenForm.patchValue({ total: total - this.ordenForm.get('descuento')!.value });
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

  mostrarFormularioCreacion() {
    this.mostrarFormulario = true;
  }

  ocultarFormularioCreacion() {
    this.mostrarFormulario = false;
    this.resetForm();
  }

  crearOrden() {
    if (this.ordenForm.valid) {
      const nuevaOrden: OrdenDTO = this.ordenForm.value;
      nuevaOrden.fecha = new Date(nuevaOrden.fecha);
      this.ordenService.crearOrden(nuevaOrden).subscribe(
        ordenCreada => {
          this.mostrarMensaje('Orden creada con éxito');
          this.cargarOrdenes();
          this.ocultarFormularioCreacion();
        },
        error => this.mostrarError('Error al crear la orden')
      );
    }
  }

  resetForm() {
    this.ordenForm.reset({
      usuarioId: '',
      detalles: [],
      fecha: new Date(),
      total: 0,
      descuento: 0,
      estado: 'PENDIENTE'
    });
    while (this.detalles.length !== 0) {
      this.detalles.removeAt(0);
    }
  }

  actualizarEstadoOrden(id: number, nuevoEstado: string) {
    this.ordenService.actualizarEstadoOrden(id, nuevoEstado).subscribe(
      ordenActualizada => {
        this.mostrarMensaje('Estado de la orden actualizado');
        this.cargarOrdenes();
      },
      error => this.mostrarError('Error al actualizar el estado de la orden')
    );
  }

  cancelarOrden(id: number) {
    if (confirm('¿Está seguro de que desea cancelar esta orden?')) {
      this.ordenService.cancelarOrden(id).subscribe(
        () => {
          this.mostrarMensaje('Orden cancelada con éxito');
          this.cargarOrdenes();
        },
        error => this.mostrarError('Error al cancelar la orden')
      );
    }
  }

  cargarEstadisticas() {
    this.ordenService.obtenerEstadisticasOrdenes().subscribe(
      estadisticas => this.estadisticas = estadisticas,
      error => this.mostrarError('Error al cargar estadísticas')
    );
  }

  cambiarPagina(event: any) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.cargarOrdenes();
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
