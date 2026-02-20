import { BaseEntity } from '@lumina/shared-entities';
import { Column, Entity, Unique } from 'typeorm';

@Entity('product_categories')
@Unique(['name', 'slug'])
export class ProductCategoryEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    slug!: string;
}
