import { BaseEntity } from '@lumina/shared-entities';
import { UserRole } from '@lumina/shared-interfaces';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
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
}
