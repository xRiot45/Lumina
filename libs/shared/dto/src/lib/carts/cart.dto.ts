import { IAddToCartRequest, ICartItemResponse, ICartResponse, IUpdateCartItemRequest } from '@lumina/shared-interfaces';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class AddToCartDto implements IAddToCartRequest {
    @IsUUID('4', { message: 'Product ID must be a valid UUID' })
    @IsNotEmpty()
    productId!: string;

    @IsUUID('4', { message: 'Variant ID must be a valid UUID' })
    @IsNotEmpty()
    variantId!: string;

    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity!: number;
}

export class UpdateCartItemDto implements IUpdateCartItemRequest {
    @IsInt({ message: 'Quantity must be an integer' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity!: number;
}

export class CartItemResponseDto implements ICartItemResponse {
    @Expose()
    id!: string;

    @Expose()
    cartId!: string;

    @Expose()
    productId!: string;

    @Expose()
    variantId!: string;

    @Expose()
    quantity!: number;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}

export class CartResponseDto implements ICartResponse {
    @Expose()
    id!: string;

    @Expose()
    userId!: string;

    @Expose()
    @Type(() => CartItemResponseDto)
    items!: CartItemResponseDto[];

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}
