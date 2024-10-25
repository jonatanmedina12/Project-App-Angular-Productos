import bigDecimal from "js-big-decimal";

export interface ClientesFrecuentesDTO {
    usuarioId: number,
    nombre: string,
    cantidadOrdenes: number,
    totalGastado: bigDecimal
}
