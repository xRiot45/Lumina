export interface IProductVariant {
    id: string;
    sku: string;
    price: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}
