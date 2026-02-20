import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductCategoryEntity } from './product_category.entity';
import { ProductVariantEntity } from './product_variant.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    name!: string;

    @Index('IDX_PRODUCT_SLUG')
    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false,
    })
    slug!: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: false,
        default: 0,
    })
    basePrice!: number;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 255,
    })
    description!: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 150,
    })
    image!: string;

    // --- Relations ---

    @ManyToOne(() => ProductCategoryEntity, (category) => category.products, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'categoryId' })
    category!: ProductCategoryEntity;

    @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
        cascade: true,
    })
    variants!: ProductVariantEntity[];
}
