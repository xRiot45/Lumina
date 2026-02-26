import { IPaginationMeta, IPaginationQuery } from '../pagination/paginated-response.interface';

export interface IAddToCartRequest {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface IUpdateCartItemRequest {
    quantity: number;
}

export interface ICartActionPayload {
    userId: string;
    itemId?: string;
    data?: IAddToCartRequest | IUpdateCartItemRequest;
}

export interface ICartItemResponse {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICartResponse {
    id: string;
    userId: string;
    items: ICartItemResponse[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEnrichedCartItemProduct {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    basePrice: number;
}

export interface IEnrichedCartItemVariant {
    id: string;
    sku: string;
    price: number;
    stock: number;
}

export interface IEnrichedCartItemResponse {
    id: string;
    quantity: number;
    subTotal: number;
    createdAt?: Date;
    updatedAt?: Date;
    product: IEnrichedCartItemProduct | null;
    variant: IEnrichedCartItemVariant | null;
}

export interface IEnrichedCartResponse {
    id: string;
    userId: string;
    items: IEnrichedCartItemResponse[];
    meta?: IPaginationMeta;
}

export interface IGetCartPayload {
    userId: string;
    query: IPaginationQuery;
}

export interface IDeleteItemFromCartPayload {
    userId: string;
    cartItemId: string;
}

export interface IDeleteCartPayload {
    userId: string;
    cartId: string;
}
