import { ICreateProduct, ICreateProductVariant } from '@lumina/shared-interfaces';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateProductVariantDto implements ICreateProductVariant {
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Price cannot be negative' })
    price!: number;

    @IsNumber()
    @Min(0, { message: 'Stock cannot be negative' })
    stock!: number;
}

export class CreateProductDto implements ICreateProduct {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    basePrice!: number;

    @IsString()
    description!: string;

    @IsString()
    image!: string;

    @IsUUID('4', { message: 'Category ID must be a valid UUID' })
    @IsNotEmpty()
    categoryId!: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'Product must have at least one variant' })
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants!: CreateProductVariantDto[];
}
