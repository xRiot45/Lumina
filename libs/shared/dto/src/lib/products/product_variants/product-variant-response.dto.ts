import { IProductVariant } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';

export class ProductVariantResponseDto implements IProductVariant {
    @Expose()
    id!: string;

    @Expose()
    sku!: string;

    @Expose()
    price!: number;

    @Expose()
    stock!: number;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}
