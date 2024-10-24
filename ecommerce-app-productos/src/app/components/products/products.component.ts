import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import bigDecimal from 'js-big-decimal';
import { ProductoDTO } from 'src/app/models/producto-dto';
import { ProductoResponseDTO } from 'src/app/models/producto-response-dto';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProductsComponent {
  productos: ProductoDTO[] = [];
  productosCrear : ProductoResponseDTO[]=[]
  productosEditar : ProductoResponseDTO[]=[]

  criterioBusqueda: string = '';
  mostrarCreacion: boolean = false;
  productoForm: FormGroup;
  productoEnEdicion: ProductoDTO | null = null;

  constructor(
    private productoService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      
    });
  }

  ngOnInit() {
    this.cargarProductosActivos();
  }

  cargarProductosActivos() {
    this.productoService.getProductosActivos().subscribe(
      data => this.productos = data,
      error => this.mostrarError('Error al cargar productos')
    );
  }

  buscarProductos() {
    if (this.criterioBusqueda) {
      this.productoService.buscarProductos(this.criterioBusqueda).subscribe(
        data => this.productos = data,
        error => this.mostrarError('Error en la búsqueda')
      );
    } else {
      this.cargarProductosActivos();
    }
  }

  mostrarFormularioCreacion() {
    this.mostrarCreacion = true;
    this.productoForm.reset({ id: 0, activo: true });
    this.productoEnEdicion = null;
  }

  crearProducto() {
    if (this.productoForm.valid) {
      const nuevoProducto: ProductoResponseDTO = {
        ...this.productoForm.value,
        precio: new bigDecimal(this.productoForm.value.precio)
      };
      this.productoService.crearProducto(nuevoProducto).subscribe(
        data => {
          this.productosCrear.push(data);
          this.mostrarCreacion = false;
          this.mostrarMensaje('Producto creado con éxito');
        },
        error => this.mostrarError('Error al crear producto')
      );
    }
  }

  editarProducto(producto: ProductoDTO) {
    console.log(producto)
    this.productoEnEdicion = { ...producto };
    this.productoForm.patchValue({
      ...producto,
      price: producto.price
    });
    this.mostrarCreacion = true;
  }

  guardarEdicion() {
    if (this.productoForm.valid && this.productoEnEdicion) {
      const productoActualizado: ProductoDTO = {
        ...this.productoForm.value
      };
      console.log(productoActualizado)
      this.productoService.actualizarProducto(this.productoEnEdicion.id, productoActualizado).subscribe(
        data => {
          const index = this.productos.findIndex(p => p.id === data.id);
          if (index !== -1) {
            this.productos[index] = data;
          }
          this.cerrarFormulario();
          this.mostrarMensaje('Producto actualizado con éxito');
        },
        error => this.mostrarError('Error al actualizar producto')
      );
    }
  }

  cerrarFormulario() {
    this.mostrarCreacion = false;
    this.productoEnEdicion = null;
    this.productoForm.reset({ id: 0, activo: true });
  }

  eliminarProducto(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(
        () => {
          this.productos = this.productos.filter(p => p.id !== id);
          this.mostrarMensaje('Producto eliminado con éxito');
        },
        error => this.mostrarError('Error al eliminar producto')
      );
    }
  }
  
  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
