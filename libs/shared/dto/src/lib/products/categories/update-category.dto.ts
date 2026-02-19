import { IUpdateProductCategories } from '@lumina/shared-interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto implements IUpdateProductCategories {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
