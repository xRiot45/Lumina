import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '@lumina/shared-entities';

@Entity('user_addresses')
export class UserAddressEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => UserEntity, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column({ type: 'varchar', length: 100 })
    recipientName!: string;

    @Column({ type: 'varchar', length: 20 })
    phoneNumber!: string;

    @Column({ type: 'varchar', length: 50 })
    label!: string;

    @Column({ type: 'boolean', default: false })
    isDefault!: boolean;

    @Column({ type: 'varchar', length: 100 })
    province!: string;

    @Column({ type: 'varchar', length: 100 })
    city!: string;
    @Column({ type: 'varchar', length: 100 })
    district!: string;

    @Column({ type: 'varchar', length: 10 })
    postalCode!: string;

    @Column({ type: 'text' })
    fullAddress!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    landmark?: string | null;

    @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
    latitude?: number | null;

    @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
    longitude?: number | null;
}
