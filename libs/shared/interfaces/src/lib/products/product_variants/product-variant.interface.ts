export interface IProductVariant {
    id: string;
    sku: string;
    price: number;
    stock: number;
    productId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
