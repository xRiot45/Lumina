import { BaseEntity } from '@lumina/shared-entities/';
import { Column } from 'typeorm';

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
}
