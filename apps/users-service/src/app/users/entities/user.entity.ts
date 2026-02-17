import { RoleEnum } from '@lumina/shared-common';
import { BaseEntity } from '@lumina/shared-entities';
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
        enum: RoleEnum,
        default: RoleEnum.CUSTOMER,
    })
    role!: RoleEnum;
}
