import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { BaseEntity } from '@lumina/shared-entities';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    orderId!: string;

    @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order!: OrderEntity;

    @Column({ type: 'uuid' })
    productId!: string;

    @Column({ type: 'uuid' })
    variantId!: string;

    @Column({ type: 'varchar', length: 255 })
    productName!: string;

    @Column({ type: 'varchar', length: 255 })
    variantSku!: string;

    @Column({ type: 'text', nullable: true })
    productImage?: string | null;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'numeric', precision: 15, scale: 2 })
    price!: number;

    @Column({ type: 'numeric', precision: 15, scale: 2 })
    subTotal!: number;
}
