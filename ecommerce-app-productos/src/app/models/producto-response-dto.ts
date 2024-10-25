import bigDecimal from "js-big-decimal";

export interface ProductoResponseDTO {
    name: string;
    description: string;
    price: bigDecimal;
    stock: number;
    isDeleted:boolean;
    createdId:number;
}
