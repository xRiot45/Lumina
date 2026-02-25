import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@lumina/shared-entities';
import { CartItemEntity } from './cart-items.entity';

@Entity('carts')
export class CartEntity extends BaseEntity {
    @Index('IDX_CART_USER_ID')
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    userId!: string;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
        cascade: true,
    })
    items!: CartItemEntity[];
}
