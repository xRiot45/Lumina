import { IUpdateProduct, IUpdateProductVariant } from '@lumina/shared-interfaces';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

export class UpdateProductVariantDto implements IUpdateProductVariant {
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @Transform(({ value }) => Number(value))
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Price cannot be negative' })
    price!: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0, { message: 'Stock cannot be negative' })
    stock!: number;
}

export class UpdateProductDto implements IUpdateProduct {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    image!: string;

    @IsUUID('4', { message: 'Category ID must be a valid UUID' })
    @IsNotEmpty()
    categoryId!: string;

    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsedArray = JSON.parse(value);
                return plainToInstance(UpdateProductVariantDto, parsedArray);
            } catch {
                return value;
            }
        }
        return value;
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'Product must have at least one variant' })
    @ValidateNested({ each: true })
    @Type(() => UpdateProductVariantDto)
    variants!: UpdateProductVariantDto[];
}

export class UpdateProductPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    productId!: string;

    @ValidateNested()
    @Type(() => UpdateProductDto)
    @IsNotEmpty()
    data!: UpdateProductDto;
}
