import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity } from 'typeorm';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    slug!: string;
}
