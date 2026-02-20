import { IProductCategory } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';

export class ProductCategoryResponseDto implements IProductCategory {
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
