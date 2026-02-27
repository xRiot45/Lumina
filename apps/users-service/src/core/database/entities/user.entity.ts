import { BaseEntity } from '@lumina/shared-entities';
import { UserRole } from '@lumina/shared-interfaces';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserAddressEntity } from './user-address.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    fullName!: string;

    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
    })
    email!: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role!: UserRole;

    @OneToMany(() => UserAddressEntity, (address) => address.user)
    addresses!: UserAddressEntity[];
}
