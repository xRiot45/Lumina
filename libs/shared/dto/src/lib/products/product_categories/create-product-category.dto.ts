import { ICreateProductCategory } from '@lumina/shared-interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryDto implements ICreateProductCategory {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
