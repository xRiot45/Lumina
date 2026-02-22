export interface IUpdateProductVariant {
    sku: string;
    price: number;
    stock: number;
}

export interface IUpdateProduct {
    name: string;
    basePrice: number;
    description: string;
    image: string;
    categoryId: string;
    variants: IUpdateProductVariant[];
}

export interface IUpdateProductPayload {
    id: string;
    data: IUpdateProduct;
}
