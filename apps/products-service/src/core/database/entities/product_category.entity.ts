import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_categories')
@Unique(['name', 'slug'])
export class ProductCategoryEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    slug!: string;

    // --- Relations ---

    @OneToMany(() => ProductEntity, (product) => product.category)
    products!: ProductEntity[];
}
