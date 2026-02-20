import { IProductCategory } from '../product_categories/product-category.interface';
import { IProductVariant } from '../product_variants/product-variant.interface';

export interface IProduct {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    description: string;
    image: string;
    category: IProductCategory;
    variants: IProductVariant[];
    createdAt?: Date;
    updatedAt?: Date;
}
