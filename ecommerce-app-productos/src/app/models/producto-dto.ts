import bigDecimal from "js-big-decimal";

export interface ProductoDTO {
  id:number,
  name: string;
  description: string;
  price: bigDecimal;
  stock: number;
  isDeleted:boolean;
  createdId:number;

}
