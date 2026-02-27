import { Entity, Column, OneToMany } from 'typeorm';
import { OrderStatus } from '@lumina/shared-interfaces';
import { BaseEntity } from '@lumina/shared-entities';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    orderNumber!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
    status!: OrderStatus;

    @Column({ type: 'numeric', precision: 15, scale: 2 })
    totalAmount!: number;

    @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
    shippingCost!: number;

    @Column({ type: 'varchar', length: 255 })
    shippingAddress!: string;

    @Column({ type: 'varchar', length: 50 })
    courier!: string;

    @Column({ type: 'varchar', length: 50 })
    serviceType!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    trackingNumber?: string | null;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @Column({ type: 'timestamp', nullable: true })
    paidAt?: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    canceledAt?: Date | null;

    @Column({ type: 'text', nullable: true })
    canceledReason?: string | null;

    @OneToMany(() => OrderItemEntity, (item) => item.order, {
        cascade: true,
    })
    items!: OrderItemEntity[];
}
