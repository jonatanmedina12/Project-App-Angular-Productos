export interface UsuarioDTO {

  id: number;
  username: string;
  email: string;
  password?: string;
  activo: boolean;
  rol: string;
  totalOrdenes?: number;
  photo?:string
}
