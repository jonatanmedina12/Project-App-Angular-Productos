import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventarioDTO } from 'src/app/models/inventario-dto';
import { ProductoDTO } from 'src/app/models/producto-dto';
import { StockOperation } from 'src/app/models/stock-operation';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger('50ms', [
            animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ]
})
export class InventoryComponent implements OnInit {
  inventarios: InventarioDTO[] = [];
  productos: ProductoDTO[] = [];
  inventarioForm: FormGroup;
  editando = false;

  constructor(
    private inventarioService: InventoryService,
    private productoService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.inventarioForm = this.formBuilder.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      operationType: [1],
      reason: ['', Validators.required]
      
    });
  }

  ngOnInit() {
    this.cargarInventarios();
    this.cargarProductos();
  }

  cargarInventarios() {
    this.inventarioService.obtenerTodoElInventario().subscribe(
      data => {
        this.inventarios = [...data];
      },
      error => this.mostrarError('Error al cargar inventarios')
    );
  }

  cargarProductos() {
    this.productoService.getProductosActivos().subscribe(
      data => this.productos = data,
      error => this.mostrarError('Error al cargar productos')
    );
  }

  onSubmit() {
      const inventarioDTO: StockOperation = this.inventarioForm.value;
      console.log(this.inventarioForm.value)
        this.inventarioService.actualizarInventario(this.inventarioForm.value.productId, inventarioDTO).subscribe(
          () => {
            this.mostrarMensaje('Inventario actualizado con éxito');
            this.cargarInventarios();
            this.resetForm();
          },
          error => this.mostrarError('Error al actualizar inventario')
        );
      
    
  
}

  editarInventario(inventario: InventarioDTO) {
    this.inventarioForm.patchValue(inventario);
    this.editando = true;
  }

  eliminarInventario(productoId: number) {
    if (confirm('¿Está seguro de eliminar este registro de inventario?')) {
      this.inventarioService.eliminarInventario(productoId).subscribe(
        () => {
          this.mostrarMensaje('Inventario eliminado con éxito');
          this.cargarInventarios();
        },
        error => this.mostrarError('Error al eliminar inventario')
      );
    }
  }

  actualizarStock(productoId: number, cantidad: number) {
    this.inventarioService.actualizarStock(productoId, cantidad).subscribe(
      (inventarioActualizado) => {
        const index = this.inventarios.findIndex(inv => inv.id === productoId);
        if (index !== -1) {
          this.inventarios[index] = inventarioActualizado;
          this.inventarios = [...this.inventarios];
        }
        this.mostrarMensaje('Stock actualizado con éxito');
      },
      (error) => {
        console.error('Error al actualizar stock:', error);
        this.mostrarError('Error al actualizar stock. Por favor, intente de nuevo.');
        this.obtenerInventarioActualizado(productoId);
      }
    );
  }

  obtenerInventarioActualizado(productoId: number) {
    this.inventarioService.obtenerInventarioActualizado(productoId).subscribe(
      (inventarioActualizado) => {
        const index = this.inventarios.findIndex(inv => inv.id === productoId);
        if (index !== -1) {
          this.inventarios[index] = inventarioActualizado;
          this.inventarios = [...this.inventarios];
        }
      },
      (error) => {
        console.error('Error al obtener inventario actualizado:', error);
        this.mostrarError('Error al obtener datos actualizados. Por favor, recargue la página.');
      }
    );
  }

  verificarDisponibilidad(productoId: number, cantidadRequerida: number) {
    this.inventarioService.verificarDisponibilidad(productoId, cantidadRequerida).subscribe(
      disponible => {
        const mensaje = disponible ? 'Producto disponible' : 'Producto no disponible';
        this.mostrarMensaje(mensaje);
      },
      error => this.mostrarError('Error al verificar disponibilidad')
    );
  }

  resetForm() {
    this.inventarioForm.reset();
    this.editando = false;
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
