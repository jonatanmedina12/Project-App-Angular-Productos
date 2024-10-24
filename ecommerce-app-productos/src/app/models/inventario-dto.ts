export interface InventarioDTO {

    id: number;
    productId: number;
    productName: string;
    quantity: number;
    operationType: number;
    reason: string;
    modifiedByUserName: string;
    previousStock: number;
    newStock: number;
    createdAt: string;

}

