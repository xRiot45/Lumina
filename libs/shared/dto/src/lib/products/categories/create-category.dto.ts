import { ICreateProductCategories } from '@lumina/shared-interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryDto implements ICreateProductCategories {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
