import {
    IAddToCartRequest,
    ICartItemResponse,
    ICartResponse,
    IEnrichedCartItemProduct,
    IEnrichedCartItemResponse,
    IEnrichedCartItemVariant,
    IUpdateCartItemRequest,
} from '@lumina/shared-interfaces';
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

export class EnrichedCartItemProductDto implements IEnrichedCartItemProduct {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    slug!: string;

    @Expose()
    image!: string | null;

    @Expose()
    basePrice!: number;
}

export class EnrichedCartItemVariantDto implements IEnrichedCartItemVariant {
    @Expose()
    id!: string;

    @Expose()
    sku!: string;

    @Expose()
    price!: number;

    @Expose()
    stock!: number;
}

export class EnrichedCartItemResponseDto implements IEnrichedCartItemResponse {
    @Expose()
    id!: string;

    @Expose()
    quantity!: number;

    @Expose()
    subTotal!: number;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;

    @Expose()
    @Type(() => EnrichedCartItemProductDto)
    product!: EnrichedCartItemProductDto | null;

    @Expose()
    @Type(() => EnrichedCartItemVariantDto)
    variant!: EnrichedCartItemVariantDto | null;
}
