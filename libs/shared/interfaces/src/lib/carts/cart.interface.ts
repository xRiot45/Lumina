// ==========================================
// REQUEST INTERFACES (From Frontend To Gateway)
// ==========================================

export interface IAddToCartRequest {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface IUpdateCartItemRequest {
    quantity: number;
}

// ==========================================
// PAYLOAD INTERFACES (From Gateway To Microservice)
// ==========================================

export interface ICartActionPayload {
    userId: string;
    itemId?: string; // Digunakan untuk Update/Delete spesifik item
    data?: IAddToCartRequest | IUpdateCartItemRequest;
}

// ==========================================
// RESPONSE INTERFACES (From Microservice To Gateway/Frontend)
// ==========================================

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
