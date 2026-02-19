import { IUpdateProductCategory } from '@lumina/shared-interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto implements IUpdateProductCategory {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
