import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_variants')
export class ProductVariantEntity extends BaseEntity {
    @Index('IDX_VARIANT_SKU')
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
    })
    sku!: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: false,
        default: 0,
    })
    price!: number;

    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    stock!: number;

    // --- Relations ---

    @ManyToOne(() => ProductEntity, (product) => product.variants, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'productId' })
    product!: ProductEntity;
}
