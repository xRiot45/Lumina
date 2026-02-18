import { IProductCategories } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';

export class ProductCategoryResponseDto implements IProductCategories {
    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    slug!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}
