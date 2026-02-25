import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
@Unique('UQ_CART_ITEM_VARIANT', ['cartId', 'productId', 'variantId'])
export class CartItemEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 36, nullable: false })
    cartId!: string;

    // Soft Reference to products-service
    @Index('IDX_CART_ITEM_PRODUCT_ID')
    @Column({ type: 'varchar', length: 36, nullable: false })
    productId!: string;

    // Soft Reference to products-service
    @Index('IDX_CART_ITEM_VARIANT_ID')
    @Column({ type: 'varchar', length: 36, nullable: false })
    variantId!: string;

    @Column({ type: 'int', default: 1, nullable: false })
    quantity!: number;

    @ManyToOne(() => CartEntity, (cart) => cart.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'cartId' })
    cart!: CartEntity;
}
