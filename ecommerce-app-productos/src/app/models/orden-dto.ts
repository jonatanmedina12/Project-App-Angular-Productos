import { DetalleOrdenDTO } from "./detalle-orden-dto";
import BigDecimal from 'js-big-decimal';

export interface OrdenDTO {

    id: number;
    usuarioId: number;
    detalles: DetalleOrdenDTO[];
    fecha: Date;
    total: BigDecimal;
    descuento: BigDecimal;
    estado: string;
}
