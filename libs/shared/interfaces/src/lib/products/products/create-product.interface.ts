export interface ICreateProductVariant {
    sku: string;
    price: number;
    stock: number;
}

export interface ICreateProduct {
    name: string;
    basePrice: number;
    description: string;
    image: string;
    categoryId: string;
    variants: ICreateProductVariant[];
}
