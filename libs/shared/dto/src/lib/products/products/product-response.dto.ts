import { IProduct } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';
import { ProductCategoryResponseDto } from '../product_categories/product-category-response.dto';
import { ProductVariantResponseDto } from '../product_variants/product-variant-response.dto';

export class ProductResponseDto implements IProduct {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    slug!: string;

    @Expose()
    basePrice!: number;

    @Expose()
    description!: string;

    @Expose()
    image!: string;

    @Expose()
    category!: ProductCategoryResponseDto;

    @Expose()
    variants!: ProductVariantResponseDto[];

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}
