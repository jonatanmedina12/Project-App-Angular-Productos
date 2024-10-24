import { ClienteTopComprasDTO } from "./cliente-top-compras-dto";
import { ProductoTopVentasDTO } from "./producto-top-ventas-dto";



export interface EstadisticasOrdenDTO {
    totalOrdenes: number;
  ventasTotales: number;
  ventasPromedio: number;
  ordenesPorEstado: { [key: string]: number };
  productosTopVentas: ProductoTopVentasDTO[];
  clientesTopCompras: ClienteTopComprasDTO[];
}
